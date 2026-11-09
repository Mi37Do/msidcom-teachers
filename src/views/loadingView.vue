<template>
  <div class="w-full h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-6">

    <!-- Mode nuit : même logo, texte en clair -->
    <img :src="estNuit ? logoNuit : logo" class="w-40" alt="">

    <span class="loading loading-ring "></span>

  </div>
</template>

<script>
// Une seule écoute du retour au premier plan pour toute la vie de l'app,
// même si l'écran de chargement est affiché plusieurs fois
let ecouteRetourInstallee = false
</script>

<script setup>
import { App } from '@capacitor/app';
import { useWidgetStore } from '@/stores/widget';
import { Capacitor } from '@capacitor/core';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFirebaseMessaging } from '@/composables/useFirebaseMessaging';
import { useTheme } from '@/composables/useTheme';
import logo from '@/assets/pics/logo.svg';
import logoNuit from '@/assets/pics/logoNuit.svg';

const useWidget = useWidgetStore()
const router = useRouter()
const { estNuit } = useTheme()
const { handleNotificationNavigation } = useFirebaseMessaging()

const ecouterRetourAuPremierPlan = () => {
  if (ecouteRetourInstallee || !Capacitor.isNativePlatform()) return
  ecouteRetourInstallee = true

  App.addListener('appStateChange', async ({ isActive }) => {
    if (!isActive) return
    console.log('App came to foreground - restoring session');
    // Profil à jour ; une session révoquée renvoie à la connexion
    await useWidget.initData();

    // Only force-redirect if we're on a public route (login/loading).
    // Otherwise this clobbers navigation from a tapped push notification,
    // which also brings the app to the foreground.
    const isOnPublicRoute = ['login-view', 'loading-view'].includes(router.currentRoute.value.name);
    if (useWidget.authUser.isAuthenticated && isOnPublicRoute) {
      router.push({ name: 'app-panel' });
    }
  });
}

onMounted(async () => {
  try {
    // Avant toute redirection : sur Android, l'import de App pointait vers App.vue
    // et l'écoute n'était jamais installée ; sur iOS, seulement si l'utilisateur était déconnecté
    ecouterRetourAuPremierPlan()

    // Initial load - check if user is already authenticated
    await useWidget.initData();

    // If already authenticated, redirect to app panel
    if (useWidget.authUser.isAuthenticated) {
      await router.push({ name: 'app-panel' });

      // Deep link from a web push notification tapped while the app was closed
      // (public/firebase-messaging-sw.js opens a window with the data encoded here)
      const params = new URLSearchParams(window.location.search);
      if (params.get('notification') === '1') {
        params.delete('notification');
        handleNotificationNavigation(Object.fromEntries(params.entries()));
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else {
      router.push({ name: 'login-view' });
    }
  } catch (error) {
    console.error('loadingView init failed:', error)
  }

})
</script>

<style lang="scss" scoped></style>

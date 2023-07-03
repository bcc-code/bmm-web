// This plugin was inspired by https://github.com/nuxt-community/applicationinsights-module

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  const classify = (str: string) =>
    str.replace(/(?:^|[-_])(\w)/g, (c) => c.toUpperCase()).replace(/[-_]/g, "");

  const formatComponentName = (vm: any, includeFile: boolean) => {
    if (vm.$root === vm) {
      return "<Root>";
    }
    const options =
      typeof vm === "function" && vm.cid != null
        ? vm.options
        : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? `<${classify(name)}>` : "<Anonymous>") +
      (file && includeFile !== false ? ` at ${file}` : "")
    );
  };

  const setupVueErrorHandling = (vm: any, appInsights: ApplicationInsights) => {
    const oldErrorHandler = vm.config.errorHandler;

    vm.config.errorHandler = (
      err: any,
      context: { $options: { propsData: any } },
      info: any
    ) => {
      appInsights.trackException({
        exception: err,
        properties: {
          errorInfo: info,
          component: context ? formatComponentName(context, true) : undefined,
          props: context ? context.$options.propsData : undefined,
        },
      });
      appInsights.flush();
      if (typeof oldErrorHandler === "function") {
        oldErrorHandler.call(context, err, context, info);
      }
    };
  };

  const setupPageTracking = (router: any, appInsights: ApplicationInsights) => {
    router.beforeEach((route: { name: any }, _from: any, next: () => void) => {
      appInsights.startTrackPage(route.name);
      next();
    });

    router.afterEach((route: { name: any }) => {
      appInsights.stopTrackPage(route.name);
    });
  };

  const connectionString = runtimeConfig.public.applicationInsights;

  const appInsights = new ApplicationInsights({
    config: {
      connectionString,
    },
  });

  if (!connectionString) {
    console.warn("No instrumentation key provided!");
  } else {
    appInsights.loadAppInsights();
  }

  const { user } = useAuth0();
  watch(
    user,
    () => {
      appInsights.setAuthenticatedUserContext(
        user.value["https://login.bcc.no/claims/personId"] ?? "unknown"
      );
    },
    { immediate: true }
  );

  setupVueErrorHandling(nuxtApp.vueApp, appInsights);
  setupPageTracking(nuxtApp.$router, appInsights);

  return {
    provide: {
      appInsights,
    },
  };
});

<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("track.details.copyright"));
</script>

<template>
  <div>
    <h2 class="pb-4 pt-10 text-[28px] font-extrabold">
      {{ t("track.details.copyright") }}
      {{ new Date().getFullYear() }}, Stiftelsen Skjulte Skatters Forlag
    </h2>
    <p>
      © Worldwide Copyright Stiftelsen Skjulte Skatters Forlag, N-3168
      Melsomvik, Norge. All tale, sang, musikk og film på
      {{ config.websiteDomain }} er kun til internt og privat bruk for slike som
      regner seg som med i Den Kristelige Menighet, heretter kalt ”DKM” og/eller
      Brunstad Christian Church, N-3168 Stokke, Norge, heretter kalt ”BCC”,
      worldwide. Videresending, kopiering eller annen form for distribusjon enn
      til eget, privat bruk er ikke tillatt, uansett i hvilket format eller form
      dette skjer. Dersom det er spørsmål rundt bruk av innholdet på
      {{ config.websiteDomain }}
      eller noe som er publisert av Stiftelsen Skjulte Skatters Forlag, heretter
      kalt 'SSSF', BMM MultiMedia Service GmbH, D-32602 Vlotho-Exter, heretter
      kalt 'BMM' eller disses internasjonale datterselskaper, avdelinger,
      filialer, foreninger og/eller stiftelser, må det skriftlig tas kontakt med
      BMM eller SSSF. All annen bruk enn til eget personlig formål for slike som
      regner seg som med i DKM/BCC worldwide, er ikke tillatt uten skriftlig
      tillatelse fra SSSF/BMM. SSSF eller SSSFs respektive datterselskaper,
      avdelinger, filialer, foreninger og/eller stiftelser har opphavsrett til
      alt materiale sendt inn til og alt arbeid utført for SSSF/BMM eller disses
      internasjonale datterselskaper, avdelinger, filialer, foreninger og/eller
      stiftelser, uavhengig av utgivelsessted eller -språk. Dette gjelder også
      taler, sang og fremføringer hos BCC, eller i en av DKMs lokalmenigheter
      eller stevnesteder worldwide. Alle moralske rettigheter frafalles.SSSF
      eller SSSFs respektive datterselskaper, avdelinger, filialer, foreninger
      og/eller stiftelser innehar derfor den globale opphavsrett til det
      oppførte og/eller tilsendte materiale, uavhengig av utgivelsesmedium eller
      av hvorvidt materialet er publisert eller ikke. Du må for øvrig gjøre deg
      godt kjent med, og følge de retningslinjer og den informasjon som er sendt
      i brev, datert august 2004 fra Sigurd J. Bratlie og Carl Hahne.
    </p>
  </div>
</template>

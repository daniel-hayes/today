<script lang="ts">
  import Hr from '../../Hr.svelte';
  import ThemeModal from '../ThemeModal.svelte';
  import state from '../../../store/state';
  import { dateTimeDifference } from '../../../utils/time';
  import getPlatform, { Platforms } from '../../../utils/getPlatform';
  import FontSize from '../FontSize.svelte';

  const { store } = state;
  const version = process.env.VERSION;
  const platform = getPlatform(process.env.PLATFORM);

  function handleBlur(e: Event) {
    const element = e.currentTarget as HTMLInputElement;
    if (element.value) {
      const newDay = element.value as `${string}:${string}`;
      state.update({ newDay });
    }
  }

  function convertTime(time: string) {
    const [hours, minutes] = time.split(':');
    const hoursNum = Number(hours);
    const minutesNum = Number(minutes);
    let timeValue: string;

    if (hoursNum > 0 && hoursNum <= 12) {
      timeValue = '' + hoursNum;
    } else if (hoursNum > 12) {
      timeValue = '' + (hoursNum - 12);
    } else if (hoursNum == 0) {
      timeValue = '12';
    }

    timeValue += minutesNum < 10 ? `:0${minutesNum}` : `:${minutesNum}`;
    timeValue += hoursNum >= 12 ? ' PM' : ' AM';

    return timeValue;
  }
</script>

<ul class="settings">
  <li>
    <span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M4.78811 0.118011C2.45837 0.572706 0.580978 2.44539 0.121592 4.76808C-0.745616 9.15097 3.20838 12.4182 6.18736 11.9565C7.15301 11.8065 7.62646 10.6768 7.18348 9.80723C6.64206 8.74315 7.41552 7.50094 8.61086 7.50094H10.4789C11.318 7.50094 11.9977 6.80718 12 5.97045C11.9883 2.27664 8.62726 -0.629657 4.78811 0.118011ZM2.24977 7.50094C1.83491 7.50094 1.49975 7.16578 1.49975 6.75093C1.49975 6.33608 1.83491 6.00092 2.24977 6.00092C2.66462 6.00092 2.99979 6.33608 2.99979 6.75093C2.99979 7.16578 2.66462 7.50094 2.24977 7.50094ZM2.99979 4.50089C2.58493 4.50089 2.24977 4.16573 2.24977 3.75088C2.24977 3.33603 2.58493 3.00087 2.99979 3.00087C3.41464 3.00087 3.7498 3.33603 3.7498 3.75088C3.7498 4.16573 3.41464 4.50089 2.99979 4.50089ZM5.99986 3.00087C5.585 3.00087 5.24984 2.66571 5.24984 2.25086C5.24984 1.83601 5.585 1.50085 5.99986 1.50085C6.41471 1.50085 6.74987 1.83601 6.74987 2.25086C6.74987 2.66571 6.41471 3.00087 5.99986 3.00087ZM8.99993 4.50089C8.58507 4.50089 8.24991 4.16573 8.24991 3.75088C8.24991 3.33603 8.58507 3.00087 8.99993 3.00087C9.41478 3.00087 9.74995 3.33603 9.74995 3.75088C9.74995 4.16573 9.41478 4.50089 8.99993 4.50089Z"
        />
      </svg>
      <p>Current Theme:</p>
    </span>
    <ThemeModal />
  </li>
  <li>
    <span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M13.5 6.73725C13.5069 10.4563 10.4739 13.4974 6.75489 13.5C5.14864 13.5011 3.67322 12.9412 2.51377 12.0054C2.21228 11.7621 2.18975 11.3103 2.46372 11.0363L2.77038 10.7296C3.0047 10.4953 3.37878 10.4697 3.63838 10.6756C4.49261 11.3535 5.57367 11.7581 6.74999 11.7581C9.51817 11.7581 11.7581 9.51776 11.7581 6.75001C11.7581 3.98183 9.51774 1.74194 6.74999 1.74194C5.42139 1.74194 4.21469 2.25823 3.31871 3.10098L4.70012 4.48239C4.97447 4.75674 4.78017 5.22582 4.39221 5.22582H0.435484C0.194961 5.22582 0 5.03086 0 4.79033V0.833599C0 0.445637 0.46907 0.251329 0.743425 0.525657L2.08722 1.86945C3.29903 0.711364 4.94143 0 6.74999 0C10.4737 0 13.4931 3.01519 13.5 6.73725ZM8.57598 8.88157L8.84334 8.53781C9.06483 8.25303 9.01353 7.84262 8.72875 7.62115L7.62096 6.75951V3.91936C7.62096 3.55859 7.32851 3.26613 6.96774 3.26613H6.53225C6.17148 3.26613 5.87903 3.55859 5.87903 3.91936V7.61148L7.65931 8.99616C7.94409 9.21763 8.35448 9.16635 8.57598 8.88157Z"
        />
      </svg>

      <p>Todo list will clear at:</p></span
    >
    <input
      class:mobile={platform === Platforms.MOBILE}
      type="time"
      value={$store.newDay}
      on:blur={handleBlur}
    />

    {#if platform === Platforms.MOBILE}
      <time>{convertTime($store.newDay)}</time>
    {/if}
  </li>
  <li>
    <span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 0C2.68548 0 0 2.68548 0 6C0 9.31452 2.68548 12 6 12C9.31452 12 12 9.31452 12 6C12 2.68548 9.31452 0 6 0ZM8.23766 7.57258L7.75379 8.17742C7.72204 8.21712 7.68277 8.25018 7.63824 8.2747C7.59371 8.29923 7.54479 8.31474 7.49426 8.32036C7.44374 8.32597 7.3926 8.32158 7.34377 8.30744C7.29494 8.29329 7.24937 8.26966 7.20968 8.2379L5.58871 7.035C5.47545 6.94432 5.38403 6.82933 5.32121 6.69855C5.25839 6.56776 5.22579 6.42452 5.22581 6.27944V2.51613C5.22581 2.41346 5.26659 2.31501 5.33918 2.24241C5.41178 2.16982 5.51024 2.12903 5.6129 2.12903H6.3871C6.48976 2.12903 6.58822 2.16982 6.66082 2.24241C6.73341 2.31501 6.77419 2.41346 6.77419 2.51613V6L8.17742 7.02823C8.21714 7.06 8.2502 7.09929 8.27473 7.14385C8.29925 7.18841 8.31476 7.23736 8.32035 7.28792C8.32594 7.33847 8.32152 7.38963 8.30733 7.43848C8.29315 7.48732 8.26947 7.53289 8.23766 7.57258Z"
        />
      </svg>
      <p>Hours until next clear:</p></span
    >
    <time>{dateTimeDifference(new Date(), new Date($store.expires))}</time>
  </li>
  <li>
    <span>
      <svg viewBox="0 0 448 512"
        ><path
          d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"
        /></svg
      >
      <p>Font Size</p></span
    >
    <FontSize />
  </li>
</ul>
<Hr />
<ul class="links">
  <li>
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path
        d="M11.8434 3.81212L8.84331 6.73367C8.52708 7.04165 8 6.81332 8 6.35881V4.81273C4.98802 4.83357 3.71738 5.56711 4.56719 8.49415C4.66058 8.81583 4.29956 9.06492 4.04623 8.86647C3.23442 8.23053 2.5 7.01415 2.5 5.78634C2.5 2.69394 4.94998 2.08029 8 2.06284V0.515644C8 0.0607334 8.52744 -0.166872 8.84331 0.140784L11.8434 3.0624C12.0521 3.26571 12.0523 3.60864 11.8434 3.81212ZM8 8.14509V9.62476H1.33333V2.74976H2.39408C2.42775 2.74974 2.46106 2.7427 2.49202 2.72906C2.52298 2.71543 2.55095 2.69548 2.57425 2.67042C2.88577 2.33595 3.24585 2.07122 3.63704 1.86097C3.86892 1.73634 3.783 1.37476 3.52152 1.37476H1C0.447708 1.37476 0 1.83646 0 2.40601V9.96851C0 10.5381 0.447708 10.9998 1 10.9998H8.33333C8.88562 10.9998 9.33333 10.5381 9.33333 9.96851V8.06057C9.33333 7.88251 9.16256 7.75837 8.99977 7.81775C8.77153 7.901 8.52712 7.92589 8.2875 7.89031C8.13604 7.86783 8 7.98729 8 8.14509Z"
      />
    </svg>

    <p><a href="https://todaylist.io" target="_blank">About</a></p>
  </li>
</ul>
<Hr />
<p class="left small">v{version}</p>
<p class="right small">
  <a href="https://todaylist.io/privacy-policy" target="_blank"
    >Privacy Policy</a
  >
</p>

<style>
  li {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }

  .settings li {
    justify-content: space-between;
    position: relative;
  }

  svg {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  time {
    padding: 6px 10px;
  }

  input[type='time'] {
    background: var(--theme-primary-color);
    color: var(--theme-secondary-color);
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    margin: 0;
  }

  input.mobile {
    opacity: 0;
    position: absolute;
    z-index: 1;
    right: 0;
  }

  input[type='time']:hover,
  input[type='time']:focus {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
  }

  input[type='time']::-webkit-calendar-picker-indicator {
    display: none;
  }

  .links li {
    transition: background ease-in 150ms;
    padding-left: 8px;
    margin-left: -8px;
    border-radius: 4px;
  }

  .links li:hover {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
  }

  a {
    text-decoration: none;
  }

  p {
    opacity: 0.5;
    margin: 0;
  }

  span {
    display: flex;
    align-items: center;
  }

  path {
    fill: currentColor;
  }

  .small {
    font-size: 10px;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }
</style>

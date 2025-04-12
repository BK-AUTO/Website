<template>
  <!-- BEGIN FOOTER -->
  <div class="page-footer">
    <div class="footer-section">
      <div class="logo-container">
        <div class="logo" />
      </div>
      <div class="info">
        <div class="row">
          <div class="col-12 col-lg-5">
            <div class="title">{{ t('link.address') }}</div>
            <div class="divider"></div>
            <ul>
              <li>
                <span class="item-icon">
                  <svg width="12" height="14" viewBox="0 0 12 14">
                    <path
                      d="M7.5 6C7.5 5.17157 6.82843 4.5 6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5C6.82843 7.5 7.5 6.82843 7.5 6ZM12 6C12 8.8739 8.90276 12.0162 7.15886 13.5577C6.4905 14.1485 5.5095 14.1485 4.84114 13.5577C3.09724 12.0162 0 8.8739 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 7.10846 1.61464 8.39535 2.56972 9.68269C3.50366 10.9415 4.65694 12.0602 5.50343 12.8085C5.79356 13.065 6.20644 13.065 6.49657 12.8085C7.34306 12.0602 8.49634 10.9415 9.43028 9.68269C10.3854 8.39535 11 7.10846 11 6Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <p class="item-value">
                  Nhà Khung – Nhà T, Đại học BKHN, số 58- Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
                </p>
              </li>
              <li>
                <span class="item-icon">
                  <svg width="12" height="14" viewBox="0 0 12 14">
                    <path
                      d="M1.71346 4.25773C1.52289 3.00143 2.40951 1.87028 3.765 1.45573C4.26419 1.30306 4.79601 1.56507 4.97915 2.05391L5.41371 3.21389C5.55674 3.59568 5.45368 4.02606 5.15323 4.30165L3.86072 5.48722C3.73129 5.60594 3.67381 5.7847 3.70903 5.95677L3.72051 6.009C3.72766 6.04019 3.73817 6.08433 3.75235 6.13952C3.78067 6.24979 3.82381 6.40486 3.88419 6.58949C4.00432 6.95678 4.19587 7.45078 4.48087 7.94441C4.76587 8.43805 5.09791 8.85093 5.35593 9.13861C5.48563 9.28322 5.59836 9.39811 5.67969 9.47778C5.7204 9.51766 5.75337 9.54883 5.77681 9.57061L5.81694 9.60725C5.94835 9.72377 6.13126 9.76281 6.29879 9.71008L7.97178 9.18351C8.36067 9.06111 8.78493 9.18705 9.04405 9.50181L9.83551 10.4632C10.1649 10.8634 10.1262 11.4508 9.74711 11.8042C8.70999 12.7712 7.28401 12.9692 6.29143 12.1717C5.33454 11.4028 4.2084 10.2602 3.26764 8.64298C2.32469 7.022 1.89777 5.47274 1.71346 4.25773ZM4.75651 6.02252L5.8292 5.03859C6.43009 4.48741 6.63622 3.62664 6.35016 2.86307L5.91559 1.70309C5.54709 0.719475 4.47699 0.192257 3.47254 0.499449C1.78991 1.01405 0.438866 2.52289 0.724771 4.4077C0.924437 5.72398 1.38625 7.39754 2.40325 9.14581C3.41613 10.887 4.63014 12.1196 5.66506 12.9512C7.15251 14.1464 9.1392 13.7382 10.429 12.5357C11.1946 11.8219 11.2728 10.6357 10.6076 9.82765L9.81609 8.86624C9.29785 8.23672 8.44933 7.98484 7.67155 8.22965L6.2831 8.66666C6.2297 8.61178 6.16784 8.54615 6.10037 8.47093C5.87225 8.21657 5.58689 7.86009 5.3469 7.44441C5.1069 7.02873 4.94086 6.60336 4.83465 6.27862C4.80324 6.18258 4.77733 6.0962 4.75651 6.02252Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <p class="item-value">
                  <a href="tel:0829218245">0829218245 (Mr. Nghĩa)</a>
                </p>
              </li>
              <li>
                <span class="item-icon">
                  <svg width="12" height="10" viewBox="0 0 12 10">
                    <path
                      d="M0 3.03807V8C0 9.10457 0.895431 10 2 10H10C11.1046 10 12 9.10457 12 8V2C12 0.895431 11.1046 0 10 0H2C0.895431 0 0 0.89543 0 2V3.03807C0 3.03809 0 3.03804 0 3.03807ZM2 1H10C10.5523 1 11 1.44772 11 2V2.73987L6.0001 5.43212L1 2.73976V2C1 1.44772 1.44772 1 2 1ZM1 3.87552L5.76305 6.44024C5.91104 6.51992 6.08916 6.51992 6.23715 6.44024L11 3.87562V8C11 8.55229 10.5523 9 10 9H2C1.44772 9 1 8.55228 1 8V3.87552Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <p class="item-value">
                  <a href="mailto:bkauto.ste@gmail.com">bkauto.ste@gmail.com</a>
                </p>
              </li>
            </ul>
          </div>

          <div class="col-6 col-lg-3">
            <div class="title">{{ t('link.link') }}</div>
            <div class="divider"></div>
            <ul>
              <li>
                <p class="item-value"><a href="about-us">{{ t('link.about') }}</a></p>
              </li>
              <li>
                <p class="item-value"><a href="about-us#intro">{{ t('link.intro') }}</a></p>
              </li>
              <li>
                <p class="item-value"><a href="about-us#milestones">{{ t('link.prize') }}</a></p>
              </li>
              <li>
                <p class="item-value"><a href="research">{{ t('link.research') }}</a></p>
              </li>
            </ul>
          </div>

          <div class="col-6 col-lg-4">
            <div class="title">{{ t('link.contact') }}</div>
            <div class="divider"></div>
            <div class="contacts">
              <a href="tel:0829218245"><font-awesome-icon :icon="['fas', 'phone']" /></a>
              <a href="mailto:bkauto.ste@gmail.com">
                <font-awesome-icon :icon="['fas', 'envelope']" />
              </a>
              <a href="https://www.facebook.com/BKAUTO.STE"><font-awesome-icon :icon="['fab', 'facebook']" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END FOOTER -->
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.page-footer {
  background: linear-gradient(0deg, rgba(1, 8, 9, 0.8), rgba(1, 8, 9, 0.8)),
    url('@/assets/img/background/bg-footer.webp');
  background-size: cover;

  * {
    color: #fff;
  }

  .footer-section {
    padding-top: 100px;
    padding-bottom: 100px;

    .logo-container {
      margin-bottom: 24px;
      .logo {
        width: 150px;
        height: 44px;
        background-image: url('@/assets/img/bkauto-logo.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    .info {
      .title {
        font-family: $vietnam-font-2;
        text-transform: uppercase;
        font-size: 20px;
        font-weight: 600;
        line-height: 32px;
        margin-bottom: 8px;
      }
      .divider {
        width: 120px;
        border-bottom: 2px solid $color-primary;
        margin-bottom: 18px;
      }
      ul li {
        display: flex;

        .item-icon {
          margin-right: 8px;
        }
      }

      .contacts {
        svg {
          height: 24px;
          margin-right: 12px;
        }
      }
    }
  }
}
</style>

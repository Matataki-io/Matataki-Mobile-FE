<template>
  <div class="assetpage mw">
    <BaseHeader :pageinfo="{ title: $t('withdraw.assetList') }" />

    <div class="topcard">
      <div class="topcard-head">
        <div>
          <p class="topcard-title">
            {{ $t('withdraw.pendingCash') }}
          </p>
          <p class="topcard-playerincome">
            {{ playerincome }}
          </p>
        </div>
        <!-- 控制提现样式 如果修改记得修改class样式 -->
        <div
          class="withdraw"
          @click="withdrawButton"
        >
          {{ $t('withdraw.title') }}
        </div>
      </div>

      <div class="topcard-list">
        <div class="topcard-list-line">
          <p
            class="topcard-list-pricing"
            :style="
              assetsRewards.totalSignIncome > 0
                ? { color: '#41b37d' }
                : assetsRewards.totalSignIncome < 0
                  ? { color: '#d74e5a' }
                  : { color: '#000000' }
            "
          >
            {{ assetsRewards.totalSignIncome }}
          </p>
          <p class="topcard-list-title">
            {{ $t('withdraw.createIncome') }}
          </p>
        </div>
        <div class="topcard-list-line">
          <p
            class="topcard-list-pricing"
            :style="
              assetsRewards.totalShareIncome > 0
                ? { color: '#41b37d' }
                : assetsRewards.totalShareIncome < 0
                  ? { color: '#d74e5a' }
                  : { color: '#000000' }
            "
          >
            {{ assetsRewards.totalShareIncome }}
          </p>
          <p class="topcard-list-title">
            {{ $t('withdraw.supportIncome') }}
          </p>
        </div>
        <div class="topcard-list-line">
          <p
            class="topcard-list-pricing"
            :style="
              assetsRewards.totalShareExpenses > 0
                ? { color: '#41b37d' }
                : assetsRewards.totalShareExpenses < 0
                  ? { color: '#d74e5a' }
                  : { color: '#000000' }
            "
          >
            {{ assetsRewards.totalShareExpenses }}
          </p>
          <p class="topcard-list-title">
            {{ $t('withdraw.supportExpenditure') }}
          </p>
        </div>
      </div>
    </div>

    <AssetList
      :id="id"
      :type="type"
      @getOtherAsset="getOtherAsset"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AssetList from './AssetList.vue'
import { precision } from '@/common/precisionConversion'

export default {
  name: 'AssetType',
  components: { AssetList },
  props: ['id', 'type'],
  data() {
    return {
      assets: [],
      playerincome: 0,
      assetsRewards: {
        totalSignIncome: 0,
        totalShareIncome: 0,
        totalShareExpenses: 0
      },
      visible: false
    }
  },
  created() {
    // 认为是用户手动切换非法地址  考虑要不要移到路由里面去拦截
    const assetTypeArr = ['EOS', 'ONT']
    if (!assetTypeArr.includes(this.type)) this.$router.push('/home')
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  methods: {
    // 得到明细数据
    getOtherAsset(res) {
      const {
        balance,
        totalSignIncome: sign,
        totalShareIncome: shareIn,
        totalShareExpenses: shareExp
      } = res.data.data
      const { assetsRewards } = this

      const precisionFunc = amount => {
        const amountType = amount > 0 ? '+' : ''
        return amountType + precision(amount, this.type)
      }

      this.playerincome = precision(balance, this.type)

      assetsRewards.totalSignIncome = precisionFunc(sign)
      assetsRewards.totalShareIncome = precisionFunc(shareIn)
      assetsRewards.totalShareExpenses = precisionFunc(shareExp)
    },
    // 提现按钮单击
    withdrawButton() {
      if (this.playerincome <= 0) {
        this.$toast.fail({ duration: 1000, message: this.$t('withdraw.notBalance') })
        return
      }
      this.$router.push({ name: 'Withdraw', params: { id: this.id, type: this.type } })
    }
  }
}
</script>

<style lang="less" scoped src="./Asset.less"></style>

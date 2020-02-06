<template>
  <div class="related-list">
    <div class="related-list-title no-margin-bottom">
      <div class="fl jsb">
        <div class="fl ac related-7">
          <div class="related-list-link">
            <a
              v-if="card.sign_id !== 0 && card.channel_id === 1"
              :href="cardUrl"
              @click.stop="toggleArticle(card.sign_id, $event)"
            >{{ cardTitle }}</a>
            <a v-else :href="cardUrl" target="_blank">{{ cardTitle }}</a>
          </div>
        </div>
        <!-- <div class="fl ac jfe related-3">
                  <span class="related-id">{{ card.number }}</span>
        </div>-->
      </div>
      <div class="fl ac related-link">
        <a class="link" href="javascript:void(0);">{{ cardUrl }}</a>
        <svg-icon @click.stop="copyCode(cardUrl)" class="icon-copy" icon-class="copy2" />
        <a :href="cardUrl" target="_blank">
          <svg-icon class="icon-share" icon-class="jump" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    cardTitle() {
      let {channel_id, title, summary} = this.card
      return channel_id === 1 ? title : channel_id === 3 ? summary : title
    },
    cardUrl() {
      let {channel_id, sign_id} = this.card
      let routerName = channel_id === 1 ? 'p' : channel_id === 3 ? 'share' : 'p'
      return `${process.env.VUE_APP_URL}/${routerName}/${sign_id}`
    }
  },
  methods: {
    // 切换文章
    toggleArticle(id, e, popEvent = false) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      if (id !== -1) this.$emit('getArticle', id, popEvent)
      else window.open(this.cardUrl)
      return false
    },
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$message.success(this.$t('success.copy'))
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    },
  }
}
</script>


<style lang="less" scoped>
.related-list {
  border-radius: 6px;
  border: 1px solid rgba(219, 219, 219, 1);
  margin-top: 10px;
  padding: 10px;
  transition: all 0.3s;
  &:hover {
    .related-edit {
      display: block;
    }
  }
}
.related-3 {
  width: 30%;
}
.related-7 {
  width: 70%;
}

.related-list-link {
  a {
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 1);
    margin-top: 10px;
    margin-bottom: 10px;
    word-break: break-all;
  }
}
.related-icon-icon {
  color: @purpleDark;
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
.related-id {
  font-size: 14px;
  color: rgba(178, 178, 178, 1);
  line-height: 20px;
  margin-left: 10px;
}
.related-link {
  font-size: 14px;
  color: #b2b2b2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  .link {
    color: #b2b2b2;
    max-width: 70%;
    display: inline-block;
    overflow: hidden;
    cursor: default;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon-copy {
    margin-left: 8px;
    cursor: pointer;
  }
  .icon-share {
    cursor: pointer;
    color: #b2b2b2;
    margin-left: 10px;
  }
}

.related-list-title {
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 1);
  // margin-top: 10px;
  // margin-bottom: 10px;
  &.no-margin-bottom {
    margin-bottom: 0;
  }
}

.related-list-content {
  font-size: 14px;
  color: rgba(0, 0, 0, 1);
  line-height: 1.5;
  // margin-top: 10px;
  overflow: hidden;
  // max-height: 530px;
  transition: all 0.28s;
  word-break: break-word;
}
.related-list .open {
  .related-list-content {
    max-height: 80px;
  }
  .arrow-up {
    transform: rotate(180deg);
  }
}

.related-more {
  display: flex;
  align-items: center;
  justify-content: center;
  color: @purpleDark;
  font-size: 14px;
  margin: 10px 0 0;
  position: relative;
  .more-full {
    position: absolute;
    left: 0;
    right: 0;
    top: -40px;
    width: 100%;
    height: 40px;
    background: linear-gradient(
      0deg,
      rgb(255, 255, 255) 0,
      rgba(255, 255, 255, 0.4) 100%
    );
    transition: all 0.3s;
  }
  span {
    cursor: pointer;
  }
  .arrow-up {
    transition: transform 0.3s;
  }
}
.summary {
  font-size: 12px;
  color: #333;
}
</style>
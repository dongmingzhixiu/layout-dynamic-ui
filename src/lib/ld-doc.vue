<template>
  <div>
    <p v-if="typeof doc=='string'" v-html="doc"></p>
    <template v-else-if="typeof doc=='object'&&!Array.isArray(doc)">
      <template v-for="(key,i) in Object.keys(doc)">
        <template v-if="typeof doc[key]=='object'">
          <doc :doc="doc[key]" :key="`${index}_${i}`" :index="i">
            <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
              <div :key="`slot_${index}_${j}`">
                <slot :name="keys" :item="doc[key]"></slot>
              </div>
            </template>
          </doc>
        </template>
        <template v-else>
          <p v-if="key.toLocaleLowerCase()=='p'" :key="`${index}_${i}`" v-html="doc[key]"></p>
          <h1 v-else-if="key.toLocaleLowerCase()=='h1'" :key="`${index}_${i}`" v-html="doc[key]"></h1>
          <h2 v-else-if="key.toLocaleLowerCase()=='h2'" :key="`${index}_${i}`" v-html="doc[key]"></h2>
          <h3 v-else-if="key.toLocaleLowerCase()=='h3'" :key="`${index}_${i}`" v-html="doc[key]"></h3>
          <div v-else-if="key.toLocaleLowerCase()=='shell'" :key="`${index}_${i}`" class="code" lang="shell"
            v-html="doc[key]"></div>
          <div v-else-if="key.toLocaleLowerCase()=='slot'" :key="`${index}_${i}`">
            <slot :name="`${doc[key]}`" :item="doc"></slot>
          </div>
          <div v-else-if="key.toLocaleLowerCase().indexOf('tip')==0" :key="`${index}_${i}`" :class="getTipClass(key)"
            v-html="doc[key]"></div>
          <div class="p10 p-l5 bor-ef c6" v-else :key="`${index}_${i}`" v-html="doc[key]"></div>
        </template>
      </template>
    </template>
    <template v-else>
      <template v-for="(item ,i) in (Array.isArray(doc)?doc:[doc])">
        <doc :doc="item" :key="`${index}_${i}`" :index="i">

          <!-- 向上传递插槽： -->
          <template v-slot:[keys]="e" v-for="(keys,j) in Object.keys($scopedSlots)">
            <div :key="`slot_${index}_${j}`">
              <slot :name="keys" :item="item"></slot>
            </div>
          </template>

        </doc>
      </template>
    </template>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'doc',
    props: {
      doc: {
        type: [Array, Object, String],
        default: ''
      },
      index: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {}
    },
    methods: {
      getTipClass(key) {
        if (key.length <= 0) {
          return ''
        }
        return `tip-${key.substr(-1)} b-${key.substr(-1)}1 m-b5`;
      },
    },
    created() {}
  }
</script>

<style>
</style>

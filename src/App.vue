<script>
import {XRegion as XRegion4} from '../dist/city-region.umd'
import {XRegion as XRegion3} from '../dist/city-region-no-street.umd'
import XRegion from './components/XltRegion/index.vue'

export default {
    name: 'App',
    components: {
        XRegion4,
        XRegion3,
        XltRegion: XRegion
    },
    data() {
        return {
            areaData: {
                area: 150522,
                city: 1505,
                province: 15,
                street: 150522208,
            },
            areaArr: [15, 1505, 150522, 150522208]
        }
    },
    watch: {
        areaData(val) {
            console.log(val, 35)
        },
        areaArr(val) {
            console.log(val, 267)
        }
    },
}
</script>
<template>
    <div id="app">
        <div>
            <p>v-model/value 数组</p>
            <xlt-region v-model="areaArr" :level="4"></xlt-region>
        </div>
        <div>
            <p>v-model/value 对象</p>
            <xlt-region v-model="areaData" :level="4"></xlt-region>
        </div>
        <div>
            <p>四级行政区域</p>
            <x-region4 v-model="areaData" :level="4"></x-region4>
        </div>
        <div>
            <p>三级行政区域</p>
            <x-region3 :level="4"></x-region3>
        </div>
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;

    div {
        display: flex;
        align-items: center;

    }
}

</style>

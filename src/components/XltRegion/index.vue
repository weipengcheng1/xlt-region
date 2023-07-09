<script>
import {AREA_LEVEL_3, AREA_LEVEL_4} from '@xlt-group/area-data';
import DropdownIcon from "@/components/Svg/DropdownIcon.vue";
import CloseIcon from "@/components/Svg/CloseIcon.vue";


export default {
    name: 'XltRegion',
    components: {CloseIcon, DropdownIcon},
    model: {
        prop: 'value',
        event: 'update:value',
    },
    props: {
        level: {
            type: Number,
            default: process.env['VUE_APP_LEVEL'] === 4 ? 4 : 3,
        },
        value: {
            type: [Object, Array],
            default: () => ({})
        },
        separator: {
            type: String,
            default: '/',
        },
        mouseLeaveClose: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            isOpenMenu: false,
            topBar: [
                {
                    value: 'province',
                    label: '省份/地区',
                },
                {
                    value: 'city',
                    label: '城市',
                },
                {
                    value: 'area',
                    label: '区/县',
                },
                {
                    value: 'street',
                    label: '街道',
                },
            ],
            activeTab: 'province',
            activeTabIndex: 0,
            barStyle: {},
            activeList: {
                province: [],
                city: [],
                area: [],
                street: [],
            },
            activeInfo: {
                province: {},
                city: {},
                area: {},
                street: {},
            },
            activeTopBar: [],
            activeLevel: process.env['VUE_APP_LEVEL'] === 4 ? 4 : 3,
        };
    },
    computed: {
        selectValue() {
            let _value = '';
            for (let key in this.activeInfo) {
                if (this.activeInfo[key].n) {
                    _value += this.activeInfo[key].n;
                    if (key !== 'street') {
                        _value += this.separator;
                    }
                }
            }
            let _btnText = _value.endsWith("/") ? _value.slice(0, -1) : _value;
            return _btnText ? _btnText : '请选择';
        },
        areaData() {
            return process.env.VUE_APP_LEVEL === '4' ? AREA_LEVEL_4 : AREA_LEVEL_3
        },

    },
    watch: {
        level: {
            handler(val) {
                const maxLevel = process.env.VUE_APP_LEVEL === '4' ? 4 : 3;
                if (val >= 2 && val <= maxLevel) {
                    this.activeLevel = val;
                } else {
                    this.activeLevel = maxLevel;
                }
                this.activeTopBar = this.topBar.slice(0, this.activeLevel);
            },
            immediate: true,
        },
        value: {
            handler(val) {
                // 如果value有值，就初始化
                this._initSelect(this._initValue(val))
            },
            immediate: true,
        }
    },
    methods: {
        _initSelect(val) {
            let _province = {};
            let _city = {};
            let _area = {};
            let _street = {};
            let _provinceList = [];
            let _cityList = [];
            let _areaList = [];
            let _streetList = [];
            if (val.province) {
                _province = this.getDataById(val.province) || {};
                _provinceList = this.getListByPid();
                this.activeTab = "province"
                this.activeTabIndex = 0
            } else {
                _provinceList = this.getListByPid();
                this.activeTab = "province"
                this.activeTabIndex = 0
            }
            if (val.city) {
                _city = this.getDataById(val.city) || {};
                _cityList = this.getListByPid(_province.i);
                this.activeTab = "city"
                this.activeTabIndex = 1
            }
            if (val.area) {
                _area = this.getDataById(val.area) || {};
                _areaList = this.getListByPid(_city.i);
                this.activeTab = "area"
                this.activeTabIndex = 2
            }
            if (val.street) {
                _street = this.getDataById(val.street) || {};
                _streetList = this.getListByPid(_area.i);
                this.activeTab = "street"
                this.activeTabIndex = 3
            }
            this.activeInfo = {
                province: _province,
                city: _city,
                area: _area,
                street: _street,
            };
            this.activeList = {
                province: _provinceList,
                city: _cityList,
                area: _areaList,
                street: _streetList,
            };
        },

        /**
         * 初始化v-model/value 的值
         * @param value
         * @returns {{}}
         * @private
         */
        _initValue(value) {
            let _modelValue = {};
            if (Array.isArray(value)) {
                const keys = ['province', 'city', 'area', 'street'];
                keys.forEach((key, index) => {
                    _modelValue[key] = value[index] ? value[index] : '';
                });
            } else {
                _modelValue = value;
            }
            return _modelValue;
        },
        /**
         * topBar点击事件
         * @param value  当前bar的值
         * @param index  当前bar的索引
         */
        onTopBarActive(value, index) {
            this.activeTab = value;
            this.activeTabIndex = index
        },
        openDropdown($event) {
            this.isOpenMenu = !this.isOpenMenu;
        },
        /**
         * 关闭选择器
         */
        closeSelector() {
            const jsonObj = {
                // 默认选中相关的列表
                address: [], // 以这个的数量为参考
                // 默认选中的项目
                select: [], // 这里的数量只会比address少于或等于
            };
            const {province, city, area, street} = JSON.parse(JSON.stringify(this.activeInfo));
            if (province.i) {
                jsonObj.address.push(province.i);
                jsonObj.select.push(province);
            }
            if (city.i) {
                jsonObj.address.push(city.i);
                jsonObj.select.push(city);
            }
            if (area.i) {
                jsonObj.address.push(area.i);
                jsonObj.select.push(area);
            }

            if (street.i) {
                jsonObj.address.push(street.i);
                jsonObj.select.push(street);
            }
            this.isOpenMenu = false
            this.$emit("on-change", jsonObj)
        },
        /**
         * 设置v-model的值
         */
        onValueModel() {
            let args = {};
            args = {
                province: this.activeInfo.province.i,
                city: this.activeInfo.city.i,
            }
            if (this.activeLevel === 3 || this.activeLevel === 4) {
                args.area = this.activeInfo.area.i
            }
            if (this.activeLevel === 4) {
                args.street = this.activeInfo.street.i
            }
            this.$emit('update:value', Array.isArray(this.value) ? [args.province, args.city, args.area, args.street] : args);
        },
        onClosed() {
            this.closeSelector()
            this.onValueModel()
        },
        switchTab(item) {
            this.activeTab = item.value;
        },
        /**
         * 地区数据切换
         * @param item 点击的地区数据
         */
        selectNode(item) {
            if (this.activeTab === 'province') {
                this.activeInfo['province'] = item;
                this.activeInfo['city'] = {};
                this.activeInfo['area'] = {};
                this.activeInfo['street'] = {};
                this.activeList['city'] = this.getListByPid(item.i);
                this.activeTab = 'city';
                this.activeTabIndex = 1
            } else if (this.activeTab === 'city') {
                this.activeInfo['city'] = item;
                this.activeInfo['area'] = {};
                this.activeInfo['street'] = {};
                this.activeList['area'] = this.getListByPid(item.i);
                if (this.activeLevel === 2) {
                    this.onClosed()
                } else {
                    this.activeTab = 'area';
                    this.activeTabIndex = 2
                }
            } else if (this.activeTab === 'area') {
                this.activeInfo['area'] = item;
                this.activeInfo['street'] = {};
                this.activeList['street'] = this.getListByPid(item.i);
                if (this.activeLevel === 3) {
                    this.onClosed()
                } else {
                    this.activeTab = 'street';
                    this.activeTabIndex = 3
                }
            } else if (this.activeTab === 'street') {
                this.activeInfo['street'] = item;
                this.onClosed()
            }
        },
        /**
         * 点击暂不选择时触发的事件
         * @param type
         */
        onUnSelectSaveAddress(type) {
            this.activeInfo = {
                province: type === 'province' ? {} : this.activeInfo.province,
                city: type === 'province' || type === 'city' ? {} : this.activeInfo.city,
                area: type === 'province' || type === 'city' || type === 'area' ? {} : this.activeInfo.area,
                street: type === 'province' || type === 'city' || type === 'area' || type === 'street' ? {} : this.activeInfo.street,
            };

            this.activeList = {
                ...this.activeList,
                city: type === 'province' ? [] : this.activeList.city,
                area: type === 'province' || type === 'city' ? [] : this.activeList.area,
                street: type === 'province' || type === 'city' || type === 'area' ? [] : this.activeList.street,
            };

            this.onClosed();
        },
        /**
         * 根据父级id获取读取地区数据
         * @param pid
         * @returns {*[]}
         */
        getListByPid(pid = 0) {
            let _list = [];
            for (let key in this.areaData) {
                let _item = this.areaData[key];
                if (_item.p === pid) {
                    _list.push(_item);
                }
            }
            return _list;
        },
        /**
         * 根据id获取地区数据
         * @param id
         * @returns {{p: number, i: number, y: string, n: string} | {p: number, i: number, y: string, n: string} | {p: number, i: number, y: string, n: string} | {p: number, i: number, y: string, n: string} | {p: number, i: number, y: string, n: string}}
         */
        getDataById(id) {
            return this.areaData.find(item => item.i === id);
        },
        // 清空选中的值
        clearSelectValue() {
            this.activeInfo = {
                province: {},
                area: {},
                city: {},
                street: {},
            }
            this.activeList = {
                ...this.activeList,
                city: [],
                area: [],
                street: [],
            }
            this.activeTab = "province"
            this.activeTabIndex = 0

        },
        mouseenterInput(e) {
        },
        mouseleaveInput(e) {
            if (this.mouseLeaveClose) {
                this.isOpenMenu = false
            }
        }
    },
};
</script>

<template>
    <div v-cloak ref="region" class="city-region-container">
        <!--输入框部分-->
        <div class="city-region-input">
            <input :value="selectValue" class="city-region-input__inner" readonly type="button" @click="openDropdown"/>
            <div class="city-region-input__suffix">
                <close-icon v-if="selectValue && selectValue !== '请选择'"
                            class="city-region-input__clear"

                            @click.native="clearSelectValue"/>
                <dropdown-icon v-else :is-open-menu="isOpenMenu" @click.native="openDropdown"/>
            </div>
        </div>
        <!--下拉菜单部分 -->
        <div v-show="isOpenMenu" class="city-region-menu" @mouseenter="mouseenterInput"
             @mouseleave="mouseleaveInput">
            <div class="top-bar">
                <div
                    v-for="(item, index) in activeTopBar"
                    :key="index"
                    :class="{
                         'top-bar__item': true,
                         'top-bar__item--active': item.value === activeTab,
                     }"
                    @click="onTopBarActive(item.value, index)">
                    <span v-show="item.value === 'province' && activeList.province.length > 0">{{ item.label }}</span>
                    <span v-show="item.value === 'city' && activeList.city.length > 0">{{ item.label }}</span>
                    <span v-show="item.value === 'area' && activeList.area.length > 0">{{ item.label }}</span>
                    <span v-show="item.value === 'street' && activeList.street.length > 0">{{ item.label }}</span>
                </div>
            </div>
            <!--<div class="search-data">-->
            <!--    <input class="city-region-input__inner" :placeholder="`请输入${topBar[activeTabIndex].label}`"/>-->
            <!--</div>-->

            <!--    列表页-->
            <div class="city-region-menu__content">
                <div class="city-region-menu__item">
                    <div class="operate">
                        <span class="operate-left">选择{{ topBar[activeTabIndex].label }}</span>
                        <span class="operate-right cursor" @click="onUnSelectSaveAddress(activeTab)">暂不选择</span>
                    </div>
                    <div class="city-region-menu__item-span">
                        <span
                            v-for="item in activeList[activeTab]"
                            :key="item.i"
                            :class="[item.i === activeInfo[activeTab].i ? 'is-active' : '']"
                            @click="selectNode(item)">{{ item.n }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
[v-cloak] {
    display: none;
}

.city-region {
    &-container {
        display: inline-block;
        position: relative;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        color: #13161b;
        user-select: none;

        .search-data {
            padding: 8px 0;
        }
    }


    &-input {
        //position: relative;
        display: flex;
        align-items: center;
        border: 1px solid #dcdfe6;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        border-radius: 4px;
        padding-right: 8px;

        &__inner {
            background-color: #fff;
            background-image: none;
            border: none;

            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 30px;
            line-height: 30px;
            outline: none;
            padding: 0 8px;
            cursor: pointer;
            width: fit-content;
        }

        &__suffix {
            //position: absolute;
            height: 100%;
            text-align: center;
            color: #c0c4cc;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    &-icon {
        width: 24px;
        height: 20px;
        transform: rotate(0deg);
        transition: transform 0.3s;

        &.is-reverse {
            transform: rotate(180deg);
        }
    }

    &-menu {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 300px;
        min-height: 400px;
        margin: 0;
        padding: 10px 15px;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;

        .operate {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 0px;

            .operate-left {
                color: #717376;
            }

            .operate-right {
                color: #2069e3;
            }
        }

        &__item {


            &-span {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;

                span {
                    width: max-content;
                    display: inline-block;
                    padding: 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: 0.2s background-color linear;

                    &:hover {
                        background: #daecff;
                        color: #144cbd;
                    }
                }
            }

            .is-active {
                background: #daecff;
                color: #144cbd;
            }
        }

        &__tabs {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ebeef5;
            position: relative;

            &--item {
                width: 25%;
                text-align: center;
                padding: 0 10px;
                cursor: pointer;

                &.is-active {
                    color: #409eff;
                    font-weight: bold;
                }
            }
        }

        .top-bar {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            &__item {
                margin-right: 14px;
                cursor: pointer;
                user-select: none;
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                color: #13161b;
            }

            &__item--active {
                font-weight: 700;
                color: #2069e3;
            }
        }
    }
}
</style>

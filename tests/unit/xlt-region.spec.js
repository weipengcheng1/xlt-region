import {mount} from '@vue/test-utils'
import {XRegion} from '../../dist/city-region.umd'
import {expect} from 'chai'

const factory = (props = {}, data = {}) => {

    return mount(XRegion, {
        propsData: {
            ...props,
        },
        data() {
            return {
                ...data,
            };
        },
    });
};


describe('XltRegion', () => {
    const wrapper = factory({
        level: 4
    });

    it("默认当前选中行政区域tab为省份", async () => {
        expect(wrapper.vm.$data.activeTab).to.equal('province')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(0)
        expect(wrapper.vm.$data.activeList.province.length).to.equal(34)
        expect(wrapper.findAll('.top-bar__item').at(0).classes('top-bar__item--active')).to.equal(true)
    });

    it("默认展示34个省份", async () => {
        expect(wrapper.findAll('.city-region-menu__item-span span').length).to.equal(34)
    })


    it("默认操作栏标题展示'选择省份/地区'", async () => {
        expect(wrapper.find('.operate-left').text()).to.equal('选择省份/地区')
    })

    it("点击省份/地区的'暂不选择'，关闭弹窗，返回值为空", async () => {
        await wrapper.find('.operate-right').trigger('click');
        expect(wrapper.vm.$data.isOpenMenu).to.equal(false)
        expect(wrapper.emitted()['on-change'][0]).to.deep.equal([{'address': [], 'select': []}])
    });

    it("选择'福建省'，当前级别自动切换至'市'级", async () => {
        await wrapper.findAll('.city-region-menu__item-span span').at(12).trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('city')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(1)
        expect(wrapper.vm.$data.activeList.city.length).to.equal(9)
        expect(wrapper.vm.$data.activeInfo.province).to.deep.equal({"i": 35, "n": "福建省", "p": 0, "y": "f"})
    });

    it("点击市的'暂不选择'，关闭弹窗，返回值为省级有值，市为空", async () => {
        await wrapper.find('.operate-right').trigger('click');
        expect(wrapper.vm.$data.isOpenMenu).to.equal(false)
        expect(wrapper.emitted()['on-change'][1]).to.deep.equal([{
            "address": [35],
            "select": [{"i": 35, "n": "福建省", "p": 0, "y": "f"}]
        }])
    });

    it("选择'福州市'，当前级别自动切换至'区/县'", async () => {
        await wrapper.findAll('.city-region-menu__item-span span').at(0).trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('area')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(2)
        expect(wrapper.vm.$data.activeList.area.length).to.equal(13)
        expect(wrapper.vm.$data.activeInfo.province).to.deep.equal({"i": 35, "n": "福建省", "p": 0, "y": "f"})
        expect(wrapper.vm.$data.activeInfo.city).to.deep.equal({"i": 3501, "n": "福州市", "p": 35, "y": "f"})

    });

    it("点击区县的'暂不选择'，关闭弹窗，返回值为省，市，区县为空", async () => {
        await wrapper.find('.operate-right').trigger('click');
        expect(wrapper.vm.$data.isOpenMenu).to.equal(false)
        expect(wrapper.emitted()['on-change'][2]).to.deep.equal([{
            address: [35, 3501],
            select: [{"i": 35, "n": "福建省", "p": 0, "y": "f"}, {"i": 3501, "n": "福州市", "p": 35, "y": "f"}]
        }])

    });

    it("选择'鼓楼区'，当前级别自动切换至'街道/乡镇'", async () => {
        await wrapper.findAll('.city-region-menu__item-span span').at(0).trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('street')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(3)
        expect(wrapper.vm.$data.activeList.street.length).to.equal(10)
        expect(wrapper.vm.$data.activeInfo.province).to.deep.equal({"i": 35, "n": "福建省", "p": 0, "y": "f"})
        expect(wrapper.vm.$data.activeInfo.city).to.deep.equal({"i": 3501, "n": "福州市", "p": 35, "y": "f"})
        expect(wrapper.vm.$data.activeInfo.area).to.deep.equal({"i": 350102, "n": "鼓楼区", "p": 3501, "y": "g"})
    })

    it("点击街道的'暂不选择'，关闭弹窗，返回值为省，市，区县，街道/乡镇为空", async () => {
        await wrapper.find('.operate-right').trigger('click');
        expect(wrapper.vm.$data.isOpenMenu).to.equal(false)
        expect(wrapper.emitted()['on-change'][3]).to.deep.equal([{
            address: [35, 3501, 350102],
            select: [{"i": 35, "n": "福建省", "p": 0, "y": "f"}, {
                "i": 3501,
                "n": "福州市",
                "p": 35,
                "y": "f"
            }, {"i": 350102, "n": "鼓楼区", "p": 3501, "y": "g"}]
        }])
    });

    it("选择'东街街道'，关闭弹窗，返回选中后的值", async () => {
        await wrapper.findAll('.city-region-menu__item-span span').at(3).trigger('click')
        expect(wrapper.vm.$data.isOpenMenu).to.equal(false)
        expect(wrapper.emitted()['on-change'][4]).to.deep.equal([{
            address: [35, 3501, 350102, 350102004],
            select: [{"i": 35, "n": "福建省", "p": 0, "y": "f"}, {
                "i": 3501,
                "n": "福州市",
                "p": 35,
                "y": "f"
            }, {"i": 350102, "n": "鼓楼区", "p": 3501, "y": "g"}, {
                "i": 350102004,
                "n": "东街街道",
                "p": 350102,
                "y": "d"
            }]
        }])
    })


    it("再次打开选择器，默认选中'街道/乡镇','东街街道'高亮显示", async () => {
        await wrapper.find('.city-region-input').trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('street')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(3)
        expect(wrapper.vm.$data.activeList.street.length).to.equal(10)
        expect(wrapper.findAll('.city-region-menu__item-span span').at(3).classes('is-active')).to.equal(true)
    });

    it("切换tab至'区/县'，'鼓楼区'选中高亮", async () => {
        await wrapper.findAll('.top-bar__item').at(2).trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('area')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(2)
        expect(wrapper.vm.$data.activeList.area.length).to.equal(13)
        expect(wrapper.findAll('.city-region-menu__item-span span').at(0).classes('is-active')).to.equal(true)
    });

    it("切换tab至'市'，'福州市'选中高亮", async () => {
        await wrapper.findAll('.top-bar__item').at(1).trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('city')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(1)
        expect(wrapper.vm.$data.activeList.city.length).to.equal(9)
        expect(wrapper.findAll('.city-region-menu__item-span span').at(0).classes('is-active')).to.equal(true)
    })

    it("切换tab至'省'，'福建省'选中高亮", async () => {
        await wrapper.findAll('.top-bar__item').at(0).trigger('click')
        expect(wrapper.vm.$data.activeTab).to.equal('province')
        expect(wrapper.vm.$data.activeTabIndex).to.equal(0)
        expect(wrapper.vm.$data.activeList.province.length).to.equal(34)
        expect(wrapper.findAll('.city-region-menu__item-span span').at(12).classes('is-active')).to.equal(true)
    })

    it('使用对象对v-model/value 设置默认值', async () => {
        await wrapper.setProps({
            value: {
                area: 150522,
                city: 1505,
                province: 15,
                street: 150522208,
            }
        })
        expect(wrapper.vm.$data.activeInfo.province).to.deep.equal({"i": 15, "n": "内蒙古自治区", "p": 0, "y": "n"})
        expect(wrapper.vm.$data.activeInfo.city).to.deep.equal({"i": 1505, "n": "通辽市", "p": 15, "y": "t"})
        expect(wrapper.vm.$data.activeInfo.area).to.deep.equal({
            "i": 150522,
            "n": "科尔沁左翼后旗",
            "p": 1505,
            "y": "k"
        })
        expect(wrapper.vm.$data.activeInfo.street).to.deep.equal({
            "i": 150522208,
            "n": "阿都沁苏木",
            "p": 150522,
            "y": "a"
        })
        expect(wrapper.find('.city-region-input__inner').element.value).to.equal('内蒙古自治区/通辽市/科尔沁左翼后旗/阿都沁苏木')
    });
    it('使用数组对v-model/value 设置默认值', async () => {
        await wrapper.setProps({value: [35, 3501, 350102, 350102005]})
        expect(wrapper.vm.$data.activeInfo.province).to.deep.equal({"i": 35, "n": "福建省", "p": 0, "y": "f"})
        expect(wrapper.vm.$data.activeInfo.city).to.deep.equal({"i": 3501, "n": "福州市", "p": 35, "y": "f"})
        expect(wrapper.vm.$data.activeInfo.area).to.deep.equal({"i": 350102, "n": "鼓楼区", "p": 3501, "y": "g"})
        expect(wrapper.vm.$data.activeInfo.street).to.deep.equal({
            "i": 350102005,
            "n": "南街街道",
            "p": 350102,
            "y": "n"
        })
        expect(wrapper.find('.city-region-input__inner').element.value).to.equal('福建省/福州市/鼓楼区/南街街道')
    });

    it("点击 X 图标，所有选中行政区域数据应该被清空", async () => {

        await wrapper.find('.city-region-input__clear').trigger('click')
        expect(wrapper.vm.$data.activeInfo.province).to.deep.equal({})
        expect(wrapper.vm.$data.activeInfo.area).to.deep.equal({})
        expect(wrapper.vm.$data.activeInfo.city).to.deep.equal({})
        expect(wrapper.vm.$data.activeInfo.street).to.deep.equal({})
        expect(wrapper.vm.$data.activeList.area).to.deep.equal([])
        expect(wrapper.vm.$data.activeList.city).to.deep.equal([])
        expect(wrapper.vm.$data.activeList.street).to.deep.equal([])
        expect(wrapper.vm.$data.activeTab).to.deep.equal('province')
        expect(wrapper.vm.$data.activeTabIndex).to.deep.equal(0)
    });
})

<template>
    <div>
        <a-tabs
            position="left"
            style="width: 100%;height: 300px;"
            @tab-click="handleTabClick"
        >
            <a-tab-pane
                v-for="tab in tabList"
                :key="tab.key"
                :title="tab.title"
            >
               <div  class="tab-content" >
                    <component
                        :is="tab.component"
                        :ref="el => tabComponents[`tabComponent-${tab.key}`] = el"
                        @submit-success="emits('submitSuccess')"
                        @submit-faild="submitFaild"
                    ></component>
                    <div class="btn-group">
                        <a-button @click="emits('close')">{{ t('取消') }}</a-button>
                        <a-button style="margin-left: 20px;" type="primary" @click="submit()">{{ t('确认') }}</a-button>
                    </div>
               </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
import ModeModalRef from '@/pages/lao-wu-guan-li/views/project/gpsConfiguration/devicelist/mode-modal.vue';  // 定位模式
import FrequencyModalRef from '@/pages/lao-wu-guan-li/views/project/gpsConfiguration/devicelist/frequency-modal.vue';  // 定位频率
import StagnationAlarmModalRef from '@/pages/lao-wu-guan-li/views/project/gpsConfiguration/devicelist/stagnation-alarm-modal.vue';  // 静止报警

const { t } = useI18n();
const emits = defineEmits(['submitSuccess', 'submitFaild', 'close']);
const currentComponent = ref(ModeModalRef)
const currentTabComponent = ref(null)
const activeKey = ref(1);
const tabComponents = ref({});
const selectDeviceType = inject('selectDeviceType');

const tabList = computed(() => {
    const list = ([{
        title: t('定位频率'),
        key: 1,
        component: FrequencyModalRef,
        ifShow: true,
    }, {
        title: t('手表定位优先级'),
        key: 2,
        component: ModeModalRef,
        ifShow: true,
    }])
    const stagnationAlarm =  {
        title: t('停滞报警设置'),
        key: 3,
        component: StagnationAlarmModalRef,
        ifShow: selectDeviceType.value === 1 || selectDeviceType.value === 4
    }
    if (selectDeviceType.value === 1 || selectDeviceType.value === 4) {
        list.push(stagnationAlarm)
    }
    return list
})

const handleTabClick = (tab: number) => {
    activeKey.value = tab;
    currentComponent.value = tabList.find((item) => item.key === tab)?.component;
    currentTabComponent.value = currentComponent.value;
}

// 提交记录
const submit = () => {
    const childComponent = tabComponents.value[`tabComponent-${activeKey.value}`];
    if (childComponent && typeof childComponent.submit === 'function') {
        childComponent.submit();
    }
};

const submitFaild = () => {
    emits('submitFaild');
    emits('close');
}

</script>

<style lang="scss" scoped>
.tab-content {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.btn-group {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: end;
}
</style>

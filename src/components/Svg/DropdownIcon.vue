<script>
export default {
    name: "DropdownIcon",
    props: {
        isOpenMenu: {
            type: Boolean,
            default: false
        }
    }


}
</script>

<template>
    <svg
            :class="{ 'is-reverse': isOpenMenu }"
            class="city-region-icon"
            height="200"
            p-id="1443"
            t="1686389627845"
            version="1.1"
            viewBox="0 0 1024 1024"
            width="200"
            xmlns="http://www.w3.org/2000/svg"
    >
        <path
                class=""
                d="M216 400c-13.3-13.3-13.3-34.8 0-48.1 13.1-13.1 34.4-13.3 47.7-0.4l0.3 0.5 248 248 248-248c13.1-13.1 34.4-13.3 47.7-0.4l0.3 0.4c13.1 13.1 13.3 34.4 0.4 47.7l-0.4 0.3-272 272c-13.1 13.1-34.4 13.3-47.7 0.4l-0.4-0.4L216 400z"
                data-spm-anchor-id="a313x.7781069.0.i0"
                fill="#A8A8A8"
                p-id="1444"
        ></path>
    </svg>
</template>

<style lang="scss">

</style>

<template>
    <!-- 系统入口 -->
    <div class="first-page">
        <div class="page-main">
            <div
                class="main-item hover"
                v-if="programPermission"
                @click="$router.push('/projectHome-list')"
            >
                <div class="icon-con">
                    <img src="../../assets/program-manage.png" alt="" />
                </div>
                <div class="text">APP Project</div>
            </div>
            <div
                class="main-item hover"
                v-if="resourcePermission"
                @click="$router.push('/operationRecord-list')"
            >
                <div class="icon-con">
                    <img src="../../assets/resource-manage.png" alt="" />
                </div>
                <div class="text">Basic Resource</div>
            </div>
            <div
                class="main-item hover"
                v-if="userPermission"
                @click="$router.push('/accountManage-list')"
            >
                <div class="icon-con">
                    <img src="../../assets/user-manage.png" alt="" />
                </div>
                <div class="text">User Account</div>
            </div>
        </div>
        <div class="page-end">Content Management System {{ version }}</div>
    </div>
</template>

<script>
export default {
    computed: {
        version() {
            return this.$store.state.version;
        },
        realName() {
            return this.$store.state.userData.realName;
        },
        userPermission() {
            return this.$store.state.permissionPage.user.view || false;
        },
        resourcePermission() {
            return this.$store.state.permissionPage.resource.view || false;
        },
        programPermission() {
            return (
                this.$store.state.permissionPage.program.view ||
                this.$store.state.permissionPage.program.add ||
                false
            );
        },
    },
    methods: {
        selectChange(command) {
            if (command === "toMymessage") {
                this.$router.push("/my-account");
            }
            if (command === "signout") {
                this.$confirm("Are you sure?", "hint", { type: "warning" })
                    .then(() => {
                        this.$request("/sys/user/logout", {}, (res) => {
                            if (!res.error) {
                                sessionStorage.clear();
                                localStorage.removeItem("aiSystem-token");
                                // 刷新清内存数据
                                this.$router.push("/login");
                                location.reload()
                            }
                        },'post',false,false);
                    })
                    .catch(() => {});
            }
        },
    },
    async created() {
        // get version
        this.$request(
            "/manage/system/version",
            {},
            (res) => {
                if (!res.error) {
                    this.$store.commit("modifyData", {
                        newdata: res.data.data,
                        name: "version",
                    });
                }
            },
            "get",
            false,
            false
        );
    },
};
</script>

<style scoped>
.first-page{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.page-head {
    /* height: 154px; */
    height: 100px;
    display: flex;
    align-items: center;
    padding: 0 61px;
}
.page-head > .head-img {
    background-color: rgb(218, 219, 219);
    height: 56px;
    width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    font-size: 50px;
}
.page-head > .head-name {
    color: rgb(119, 104, 104);
    font-size: 25px;
    margin-left: 28px;
}
.page-main {
    display: flex;
    justify-content: center;
    margin: 15vh 0 29vh 0;
}
.page-main > .main-item {
    /* flex: 1; */
    margin: 0 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.main-item .icon-con {
    border-radius: 50%;
    box-shadow: 0 0 0 5px rgb(92, 87, 88);
    width: 190px;
    height: 190px;
    box-sizing: border-box;
    padding: 20px;
    opacity: 0.7;
}
.icon-con img {
    width: 100%;
}
.main-item > .text {
    font-size: 16px;
    color: rgb(119, 104, 104);
    margin-top: 3vh;
    font-weight: 800;
}
.page-end {
    /* margin-top: 20vh; */
}
</style>
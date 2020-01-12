<template>
  <div >
    成功拉大飞哥红烧豆腐
  </div>
</template>

<script>
import elHeader from "../components/elHeader";
import { alipayOrderIsPc } from "../network/wallet.js";
import { md5, aes } from "../util/signCrypto.js";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      html: "",
      loading: ""
    };
  },
  methods: {
    
    //支付宝支付
    aliPay() {
      let id = this.$route.params.alipayData;
      let header = this.$route.params.header;
      alipayOrderIsPc(id, header).then(res => {
        this.loading.close(); //关闭加载提示
        console.log(res);
        if (res.data.code == "0000") {
          console.log(res.data.data.body);

          this.html = res.data.data.body;
          this.$nextTick(() => {
            document.forms[0].submit();
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
   
  }
};
</script>

<template>
  <h1 class="text-3xl">
    Hello <span class="text-blue-800">{{ name }}</span> from Simple
  </h1>
  <div class="my-2 flex flex-wrap -m-1">
    <button @click="radar" class="m-1 h-8 px-3 rounded-md shadow text-white bg-blue-500">
      Radar
    </button>
    <label class="m-1 px-3 rounded-md inline-flex items-center bg-gray-200">
      <input type="checkbox" class="form-checkbox" v-model="showEvens" />
      <span class="ml-2">show Evens</span>
    </label>

    <button
      @click="testMeth"
      class="m-1 h-8 px-3 rounded-md shadow text-white bg-blue-500"
    >
      Test
    </button>
  </div>
  <pre>{{ sukiens }}</pre>
  <div class="bg-white rounded-lg shadow lg:w-1/2" v-show="showEvens">
    <ul class="divide-y divide-gray-100">
      <li
        class="p-3"
        v-for="sk in sukiens"
        :class="
          sk.TypeID === 30 || sk.TypeID === 31
            ? 'bg-green-300'
            : sk.TypeID === 60
            ? 'bg-purple-300'
            : 'bg-white'
        "
      >
        <p>
          <span class="text-blue-800 text-lg">{{ sk.CompanyName }}</span>
          <span class="mx-2 text-xs px-2 bg-blue-600 text-white rounded-full">{{
            sk.Exchange
          }}</span>
        </p>
        <p class="m-0" v-if="sk.loituc">
          GDKHQ: {{ sk.GDKHQDate }} ~ E/P: {{ sk.loituc }}
        </p>
        <p class="m-0" v-else>DateOrder {{ sk.DateOrder }}</p>

        <p class="m-0">{{ sk.Note }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";

const API_URL = "http://localhost/API";

export default {
  name: "Simple",
  data() {
    return {
      showEvens: true,
      sukiens: [],
    };
  },
  mounted() {
    console.log("test mounted:", axios);
    this.getSukien();
  },
  computed: {
    name() {
      return this.$store.state.user.name;
    },
  },
  methods: {
    testMeth: () => {
      console.log("hihi 3");
    },
    getSukien: () => {
      const vm = this;
      let data = new FormData();
      const url = `${API_URL}/api_vdsc.php`;
      axios
        .get(url, data)
        .then((chivas) => {
          if (chivas) {
            const sks = chivas.data.Event.map((sk) => {
              for (const prop in sk) {
                if (/\/Date|\(|\)/g.test(sk[prop])) {
                  const momFormat = moment(
                    parseInt(sk[prop].replace(/[^0-9]/g, ""))
                  ).format("DD/MM/YYYY");
                  sk[prop] = momFormat;
                }
              }
              const cotuc = sk.Note.match(/\s[0-9|\,]+\s*đ/g);
              sk.loituc = cotuc
                ? Math.round(
                    (parseInt(cotuc[0].replace(/ đ|\,/g, "")) * 100) / sk.LastPrice
                  ) + "%"
                : "";
              return sk;
            });
            // vm.$store.dispatch("saveSKs", sks);
            console.log(vm);
          } else {
            console.log("failure api_vdsc");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>

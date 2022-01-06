<template>
  <h1 class="text-3xl">
    Hello <span class="text-blue-800">{{ name }}</span> from Home
  </h1>
  <!-- <h2 class="text-2xl">Todo:</h2>
  <ol class="ml-5">
    <li>Convert rada function</li>
      <ol class="ml-5">
        <li>Install axios</li>
        <li>Test API</li>
      </ol>
    <li>Seting .env</li>
    <li>Upgrade interface with tailwind</li>
    <li>Convert to ts</li>
    <li>Make login flow</li>
  </ol> -->
  <div class="my-2 flex flex-wrap -m-1">
    <button
      @click="getSukien"
      class="m-1 h-8 px-3 rounded-md shadow text-white bg-blue-500"
    >
      Sự kiện
    </button>

    <button
      type="button"
      @click="getRadar"
      class="m-1 h-8 px-3 rounded-md shadow text-white bg-blue-500 inline-flex items-center py-2 text-base transition ease-in-out duration-150"
      :disabled="inprogress"
      :class="{ 'cursor-not-allowed': inprogress }"
    >
      <svg
        v-if="inprogress"
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <code v-if="inprogress" class="-ml-1 mr-1 text-gray-300">{{ inprogress }} %</code>
      Radar
    </button>
    <label class="m-1 px-3 rounded-md inline-flex items-center bg-gray-200">
      <input type="checkbox" class="form-checkbox" v-model="showEvens" />
      <span class="ml-2">show {{ sukiens.length }} Evens</span>
    </label>

    <button
      @click="smocking"
      class="m-1 h-8 px-3 rounded-md shadow text-white bg-blue-500"
    >
      Test
    </button>
    <button
      @click="methodSim"
      class="m-1 h-8 px-3 rounded-md shadow text-white bg-green-500"
    >
      methodSim
    </button>
  </div>

  <component :is="ListShow" :items="suma.CutCam" />

  <pre>{{ suma }}</pre>

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
        <!-- <pre class="m-0">{{ sk }}</pre> -->
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref, inject } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import mockData from "../mock/market.js";
import ListShow from "../components/ListShow.vue";

const API_URL = "http://localhost/API";
let wantMocks = [];
const runMock = false;
export default {
  setup() {
    const axios = inject("axios");
    const store = useStore();
    const inprogress = ref(0);
    const sukiens = ref([]);

    const suma = ref({
      CutCam: [],
      ShorterShit: [],
      Bomb_10: [],
      advVol: [],
      desVol: [],
      lowVol: [],
      newBorn: [],
    });

    const smocking = () => {
      reset();
      console.log("Let's smock!!", mockData);
      for (const moke of mockData) {
        ana(moke);
      }
    };

    const getSukien = () => {
      if (sukiens.value.length) {
        console.log("sks already");
      } else {
        let data = new FormData();
        const url = `${API_URL}/api_vdsc.php`;
        let sks;
        axios
          .get(url, data)
          .then((chivas) => {
            if (chivas) {
              chivas.data.Event.forEach((sk) => {
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
                sukiens.value.push(sk);
              });
            } else {
              console.log("failure api_vdsc");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };
    getSukien();

    // CRAWL MARKET =====
    const lowest = (ar, backward, prop, _start) => {
      const start = _start ?? ar.length;
      let lowest = ar[start - 1][prop];
      const minInd = Math.max(-1, start - 1 - backward);
      for (let i = start - 1; i > minInd; i--) {
        if (ar[i][prop] < lowest) {
          lowest = ar[i][prop];
        }
      }
      return lowest;
    };
    const sma = (ar, len, prop, _start) => {
      const start = _start ?? ar.length;
      let sum = 0;
      for (let i = start; i >= (start >= len ? start - len : start); i--) {
        sum += ar[i] ? ar[i][prop] : 0;
      }
      return Math.round((sum / (start >= len ? len : start)) * 100) / 100;
    };
    const volPrifile = (candAr, len) => {
      // const supportLine = max line || top of max block
      // const 2types = rest fall in long rise && rise after long rest
      const mockCandle = {
        Date: "2021-12-23T00:00:00Z",
        Symbol: "FTS",
        PriceHigh: 57400,
        PriceLow: 54100,
        PriceOpen: 56500,
        PriceAverage: 55170.026545908804,
        PriceClose: 54300,
        DealVolume: 1280800,
        Volume: 1280800,
        TotalTrade: 1227,
        TotalValue: 70661770000,
        BuyForeignQuantity: 34800,
        BuyForeignValue: 1912650000,
        SellForeignQuantity: 9400,
        SellForeignValue: 519210000,
        BuyCount: 3238,
        BuyQuantity: 2209900,
        SellCount: 2192,
        SellQuantity: 2039400,
        BuyAvg: 682.4891908585547,
        SellAvg: 930.3832116788321,
        CurrentForeignRoom: 116324472,
        Shares: 147563892,
        MarketCap: 8012719335600,
      };
      const closeToday = candAr[len - 1].PriceClose,
        sumVol = candAr.reduce((rs, n) => rs + n.Volume, 0),
        eveVol = Math.round(sumVol / len);

      let arVol = [];
      for (let i = 0; i < len; i++) {
        const n = candAr[i],
          vol = n.Volume,
          close = n.PriceClose,
          open = n.PriceOpen,
          ind = arVol.findIndex((p) => p[0] === close);
        if (ind === -1) {
          arVol.push([close, vol]);
        } else {
          arVol[ind][1] += vol;
        }
        // const vlAble = pushVol0; // true if close >= ModValue
      }
      // .push([closeToday, "🟦"])
      const output = arVol
        .sort((a, b) => a[0] - b[0])
        .reduce(
          (rs, n) => {
            rs.str += `${n[0]}.${n[1]}|`;
            rs.max = Math.max(n[1], rs.max);
            return rs;
          },
          { max: 0, str: "" }
        );
      return output;
      // return output.map((m) => (m[1] > eveVol ? "1" : "0"));
    };
    // Đảo chiều | Sắp đảo chiều | Max Vol && %Price < 3% | Cup pattern | Decrease vol_10 | Decrease vol_5
    const ana = (arCfix) => {
      if (runMock) {
        wantMocks.push(arCfix);
        console.log("_Mocks", wantMocks);
      }
      const arC = arCfix.chart,
        arClen = arCfix.chart.length,
        code = arCfix.c;

      if (arClen > 60) {
        const volProf = volPrifile(arC, arClen),
          close0 = arC[0].PriceClose,
          fastRange = 12,
          slowRange = 26,
          signalRange = 9,
          kFast = 2 / (fastRange + 1),
          kSlow = 2 / (slowRange + 1),
          ma_vol10 = sma(arC, 10, "Volume", arClen),
          ma_vol50 = sma(arC, 50, "Volume", arClen),
          money_10 = ma_vol10 * close0;

        // **VOL TĂNG ĐỘT BIẾN
        if (ma_vol10 > ma_vol50 * 3 && ma_vol10 > 1e3) {
          suma.value.advVol.push({ c: code, ma_vol10, money_10 });
        }

        let collecOb = {
          _macd: "",
          _bomb10: false,
        };
        if (ma_vol10 < 1e5 || money_10 < 5e8) {
          // **VOL THẤP
          // suma.value.lowVol.push(code);
        } else {
          // **SIẾT VOL TRONG NHỊP CHỈNH
          const giamthanhkhoan = sma(arC, 4, "Volume", arClen) < ma_vol10 / 3;
          if (giamthanhkhoan) {
            suma.value.desVol.push(code);
          }

          const arOut = [
            {
              i: 0,
              close: close0,
              fastMA: close0,
              slowMA: close0,
              macd: 0,
              hist: 0,
              colorHis: "🟤",
              date: arC[0].Date,
              colorAr: "🟤🟤🟤",
            },
          ];

          for (let i = 1; i < arClen; i++) {
            // i === 0 has been set default value
            let getBom = () => {
              let lowest3 = lowest(arC, 3, "PriceLow", i),
                lowest50a = lowest(arC, 50, "PriceLow", i),
                lowest50b = lowest(arC, 49, "PriceLow", i),
                lowest50c = lowest(arC, 48, "PriceLow", i);
              return i > arClen - 2 && arC[arClen - 52]
                ? arC[i - 1].PriceClose < arC[i - 1].PriceOpen &&
                    arC[i].PriceClose > arC[i].PriceOpen &&
                    arC[i - 1].PriceOpen < arC[i].PriceClose &&
                    (lowest3 < lowest50a || lowest3 < lowest50b || lowest3 < lowest50c)
                : false;
            };
            const bomb_u = getBom();

            const yesVal = arOut[i - 1];
            const close = arC[i].PriceClose;
            const open = arC[i].PriceOpen;
            const volume = arC[i].Volume;
            const sloseYest = arC[i - 1].PriceClose;

            const fastMA = close * kFast + yesVal.fastMA * (1 - kFast);
            const slowMA = close * kSlow + yesVal.slowMA * (1 - kSlow);
            const macd = fastMA - slowMA;
            const signal = sma(arOut, signalRange, "macd", i);
            const hist = macd - signal;
            const colorHis =
              hist > 0
                ? hist > yesVal.hist
                  ? "🟢"
                  : "🔵"
                : hist > yesVal.hist
                ? "🟠"
                : "🟤";
            const wat =
              i > 2 &&
              colorHis === "🟤" &&
              yesVal.hist - hist < (arOut[i - 2].hist - yesVal.hist) / 2;

            if (i > arClen - 11) {
              collecOb._macd += colorHis;
              if (bomb_u) collecOb._bomb10 = true;
            }

            const temp = {
              close,
              colorAr: (arOut[i - 2]?.colorHis ?? "🟤") + yesVal.colorHis + colorHis,
              colorHis,
              date: arC[i].Date,
              fastMA,
              hist,
              i,
              ma_vol10,
              macd,
              slowMA,
              tang: Math.round(((close - sloseYest) * 100) / sloseYest),
              wat,
            };
            arOut.push(temp);
          }

          const lasBar = arOut[arOut.length - 1];
          // if (code === "BWE") console.log(code, sth); // MAIN CHECK
          let sth = {
            volProf,
            ...arCfix,
            chart: null,
            // lasBar,
            _shorterShit: lasBar.colorAr === "🟤🟤🟤" && lasBar.wat,
            ...collecOb,
            _cutcam: /🟤🟤🟠|🔵🔵🟢/.test(collecOb._macd),
          };

          if (sth._cutcam) {
            suma.value.CutCam.push(sth);
          } else if (sth._shorterShit) {
            suma.value.ShorterShit.push(sth);
          }
          if (sth._bomb10) {
            suma.value.Bomb_10.push(sth);
          }
        }
      } else if (arClen) {
        // **MỚI VÀO THỊ TRƯỜNG
        suma.value.newBorn.push({ c: code, len: arClen });
      }
    };
    const guildSan = {
      1: "HNX",
      2: "HOSE",
      9: "UPCOM",
    };
    const calldata = (ocOj, ind, total) => {
      let data = new FormData();
      // const hautoFireant = vm.apiFireant.type === 'fromto' ? `&from=${vm.apiFireant.from}&to=${vm.apiFireant.to}` : vm.apiFireant.type === 'lento' ? `&len=${vm.apiFireant.len}&to=${vm.apiFireant.to}` : '';
      const url = `${API_URL}/api_fireant.php?mack=${ocOj.c}`; // ${hautoFireant}
      axios
        .get(url, data)
        .then((chivas) => {
          let fixRes = {
            ...ocOj,
            chart: chivas.data,
            s: guildSan[ocOj.san],
            sukiens: store.state.stock.sukiens.filter(
              (post) => post.CompanyName === sth.c
            ),
          };
          ana(fixRes);
        })
        .catch((e) => {
          throw new Error(`fail ${ocOj.c}`);
        });
      // INPROGRESS PERCENT (WITH SPINNER)
      const proGessNum = Math.round((ind * 100) / total);
      inprogress.value =
        ind === total - 1
          ? 0
          : inprogress.value < proGessNum
          ? proGessNum
          : inprogress.value;
    };
    const getRadar = () => {
      const newOc = oc.filter(
        (post) => {
          return (
            post.c.length === 3 &&
            [1, 2, 9].includes(post.san) &&
            "CFQ".includes(post.c[0])
          );
        }
        // (post.c[0] === "F" || post.c[0] === "B")
      );
      const numScan = newOc.length;
      if (numScan) {
        // newOc.unshift({ c: 'HOSTC' })
        console.log("newOc::", newOc);
        reset();
        for (let i = 0; i < numScan; i++) {
          setTimeout(() => {
            calldata(newOc[i], i, numScan);
          }, i * 30);
        }
      } else {
        throw new Error("Empty newOc!");
      }
    };
    const reset = () => {
      console.log("reset tape 1");
      wantMocks = [];
      suma.value.advVol = [];
      suma.value.desVol = [];
      suma.value.lowVol = [];
      suma.value.newBorn = [];
    };

    // OUTPUT
    return {
      name: computed(() => store.state.user.name),
      getSukien,
      sukiens,
      inprogress,
      getRadar,
      suma,
      smocking,
      ListShow,
    };
  },
  data() {
    return {
      showEvens: true,
    };
  },
  mounted() {
    console.log("in Mounted", this.$router);
  },
  methods: {
    methodSim: () => {
      console.log("methodSim 12");
    },
  },
};
</script>

<style lang="scss" scoped></style>

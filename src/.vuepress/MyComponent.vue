<script setup>
import {onMounted, defineProps} from 'vue'

const props = defineProps({author: String});
onMounted(() => {
  //水印逻辑来自于 @ouka
  const domSymbol = Symbol('watermark-dom')

  function useWatermark(appendEl = document.body) {
    function useRafThrottle(fn) {
      let locked = false;
      return function (...args) {
        if (locked) return;
        locked = true;
        window.requestAnimationFrame(() => {
          fn.apply(this, args);
          locked = false;
        });
      };
    }
    const func = useRafThrottle(function () {
      const el = appendEl;
      if (!el) return;
      const {clientHeight: height, clientWidth: width} = el;
      updateWatermark({height, width});
    });
    const id = domSymbol.toString();
    let watermarkEl = "";

    const clear = () => {
      const domId = watermarkEl;
      watermarkEl = undefined;
      const el = appendEl;
      if (!el) return;
      domId && el.removeChild(domId);
    };

    function createBase64(str) {
      const can = document.createElement("canvas");
      const width = str.length <= 5 ? 260 : 40 * str.length;
      const height = str.length <= 5 ? 240 : 20 * str.length;
      Object.assign(can, {width, height});
      const cans = can.getContext("2d");
      if (cans) {
        cans.rotate((-20 * Math.PI) / 180);
        cans.font = "20px Vedana";
        cans.fillStyle = "rgba(0, 0, 0, 0.15)";
        cans.textAlign = "left";
        cans.textBaseline = "middle";
        cans.fillText(str, 0, (height / 2));

      }
      return can.toDataURL("image/png");
    }

    function updateWatermark(options) {
      const el = watermarkEl;
      if (!el) return;
      if (options.width !== undefined) {
        el.style.width = `${options.width}px`;
        // el.style.width = `50px`;
      }
      if (options.height !== undefined) {
        el.style.height = `${options.height}px`;
        // el.style.height = `50px`;
      }
      if (options.str !== undefined) {
        el.style.background = `url(${createBase64(options.str)}) left top repeat`;
      }
    }

    const createWatermark = (str) => {
      if (watermarkEl) {
        updateWatermark({str});
        return id;
      }
      const div = document.createElement("div");
      watermarkEl = div;
      div.id = id;
      div.style.pointerEvents = "none";
      div.style.top = "0px";
      div.style.left = "0px";
      div.style.position = "absolute";
      div.style.zIndex = "100000";
      const el = appendEl;
      if (!el) return id;
      const {clientHeight: height, clientWidth: width} = el;
      updateWatermark({str, width, height});
      el.appendChild(div);
      return id;
    };

    function setWatermark(str) {
      createWatermark(str);
    }
    return {setWatermark, clear};
  }
  useWatermark().setWatermark(props.author);
});
</script>

<style scoped>

</style>
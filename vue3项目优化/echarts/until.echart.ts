
import { init, graphic, getInstanceByDom, registerMap } from 'echarts/core';
import * as echartsCore from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout, UniversalTransition } from 'echarts/features';

// 按需引入图表类型
import { 
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  MapChart,
  ScatterChart,
  GraphChart,
} from 'echarts/charts';
// 按需引入组件
import { 
  TooltipComponent,
  TitleComponent, 
  GridComponent, 
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  GraphicComponent,
  TransformComponent,
  DatasetComponent, 
  GeoComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
} from 'echarts/components';

// 注册组件
echartsCore.use([
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  MapChart,
  ScatterChart,
  GraphChart,

  TooltipComponent,
  TitleComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  GraphicComponent,
  TransformComponent,
  DatasetComponent,
  GeoComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,

  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export { init, graphic, getInstanceByDom, registerMap };   
export default {
  ...echartsCore,
  init,
  graphic,
  getInstanceByDom,
  registerMap
}

import React from "react";
import { createRoot } from "react-dom/client";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


(function () {
  'use strict';
  // Set Custom View's ID in .env
  const customViewID = Number(process.env.VIEW_ID);
  // Increment to confirm script version on Kintone
  const scriptVer = '0';
  console.log(`\nScript version: ${scriptVer}\n\n`);

  kintone.events.on('app.record.index.show', function (event) {
    if (event.viewId !== customViewID) {
      console.log('View ID from APP: ' + event.viewId)
      console.log('VIEW_ID from env: ' + customViewID)
      console.log('Not on the Custom View');
      return event
    }

    function App() {

      // Peak inside Kintone's data
      console.log('event.records');
      console.log(event.records);

      // Retrieve & configure the space element below the record list's header
      const spaceDiv = kintone.app.getHeaderSpaceElement();
      spaceDiv.style.height = '650px';
      spaceDiv.style.marginLeft = '25px';
      spaceDiv.style.marginRight = '25px';
      spaceDiv.style.border = 'solid';
      spaceDiv.style.borderColor = '#ED7B84';

      // Automatically enable all amCharts animations
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.SlicedChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

      // Input Kintone data into the chart
      chart.data = event.records.map((rec, index) => {
        return {
          // Text in key; name of record
          'name': `${rec.record.value}`,
          // Quantity of records in stock; Percentage of whole
          'value': `${rec.record_stock.value}`,
        }
      });
      console.log('chart.data');
      console.log(chart.data);

      let series = chart.series.push(new am4charts.FunnelSeries());
      series.colors.step = 2;
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      series.alignLabels = true;
      series.orientation = "horizontal";
      series.bottomRatio = 1;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "top";
    }

    const rootElement = document.getElementById("root");
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    return event;
  });
})();
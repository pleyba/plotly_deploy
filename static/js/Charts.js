function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;

      // console.log(sampleNames)
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);

      // console.log(firstSample);
      
    });
  }

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }

// Initialize the dashboard
init();

  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;

      // console.log(metadata);

      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      console.log(resultArray);

      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;

      // console.log(samples);

      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);

      // console.log(sampleArray);

      //  5. Create a variable that holds the first sample in the array.
      var firstSample = sampleArray[0];

      // console.log(firstSample);
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = firstSample.otu_ids;
      var otu_labels = firstSample.otu_labels;
      var sample_values = firstSample.sample_values;

      

      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last.
      var topOTU = otu_ids.slice(0, 10).reverse()
      var top_otu = topOTU.map(d => "OTU " + d)
      var top_val = sample_values.slice(0, 10).reverse()
      var yticks = top_val.sort((a,b) => a-b)

      console.log(topOTU);
      console.log(top_otu);
      console.log(top_val);
      console.log(yticks);

      // 8. Create the trace for the bar chart. 
      var barData = [
        {
          x: top_val,
          y: top_otu,
          type: 'bar',
          orientation: 'h'
        }
        ];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
          title: 'Top 10 Bacteria Cultures Found',
          barmode: 'relative'      
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

      // 1. Create the trace for the bubble chart.
      var bubbleData = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
        };

      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: samples.wfreq,
          title: { text: 'Srubs per Week', font: { size: 24 } },
          delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
          gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 250], color: "cyan" },
              { range: [250, 400], color: "royalblue" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 490
            }
          }
        }
      
      ];
      console.log(samples.wfreq);
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        font: { color: "black", family: "Arial" }
       };
      //  console.log(Samples.wfreq);
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}

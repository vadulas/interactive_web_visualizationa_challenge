
d3.json("./data/samples.json").then((importedData) => {

	//console.log(importedData);

	let data = importedData;

	// Dynamically add test Subject ID No. to the dropdown menus
	 names = data.names;
     samples = data.samples;
     metadata = data.metadata;
     console.log(samples)

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
    });


    init();

    function init(){

        // Create a horizontal bar chart with a dropdown menu to display 
        // the top 10 OTUs found in that individual.
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.

        // Plot the bar chart

        let sel = document.getElementById("selDataset");
        let selVal  = sel.options[sel.selectedIndex].value;


        let barGraphData = getDataForGraph(selVal);
        let barTrace = {
            x: barGraphData[1],
            y: barGraphData[0].map((otu_id) => `OTU ${otu_id}`),
            text: barGraphData[2],
            type: 'bar',
            orientation: "h"
        }

        let barData = [barTrace]

        let layout = {
            title: "Top 10 OTUs"
          };
          
        Plotly.newPlot("bar", barData, layout);   
    }
});

function optionChanged(value){

    console.log(`Now the selected value is ${value}`);
    // sample = getTheValuesForSelectedSample(samples, value);
    let barGraphData = getDataForGraph(value);

    //repolot the bar graph
    Plotly.restyle("bar", "x", [barGraphData[1]])
    Plotly.restyle("bar", "y", [barGraphData[0].map((otu_id) => `OTU ${otu_id}`)])
    Plotly.restyle("bar", "text", [barGraphData[2]])
    console.log(sample);

}

function getTheValuesForSelectedSample(samples, selVal){
    for (let i = 0; i < samples.length; i++){
        sample = samples[i]

        if (sample.id == selVal) return sample;
    }
}

function getDataForGraph(selVal){
    let barGraphData = [];
    
    //Get the selected sample data
    sample = getTheValuesForSelectedSample(samples, selVal)
    console.log(sample);

    //Select the OTU IDS for the selected value in teh drop down
    let top_10_otu_ids = (sample.otu_ids).slice(0, 11).reverse();
    let top_10_values = (sample.sample_values).slice(0, 11).reverse();
    let top_10_otu_labels = (sample.otu_labels).slice(0, 11).reverse();
    barGraphData.push(top_10_otu_ids);
    barGraphData.push(top_10_values);
    barGraphData.push(top_10_otu_labels);

    return barGraphData;
    
}

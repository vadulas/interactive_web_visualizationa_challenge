
d3.json("./data/samples.json").then((importedData) => {

	let data = importedData;

	// Dynamically add test Subject ID No. to the dropdown menus
	 names = data.names;
     samples = data.samples;
     metadata = data.metadata;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
    });

    init();

    /*
    * Function to initialize the page with the default charts and data 
    */
    function init(){

        // Create a horizontal bar chart with a dropdown menu to display 
        // the top 10 OTUs found in that individual.
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.

        // Plot the bar chart

        let sel = document.getElementById("selDataset");
        let selVal  = sel.options[sel.selectedIndex].value;

        let graphData = getDataForGraph(selVal, "bar");
        let barTrace = {
            x: graphData[1],
            y: graphData[0].map((otu_id) => `OTU ${otu_id}`),
            text: graphData[2],
            type: 'bar',
            orientation: "h"
        }

        let barData = [barTrace]

        let layout = {
            title: "Top 10 OTUs"
        };
          
        Plotly.newPlot("bar", barData, layout);  
        
        // Plot the bubble chart
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        let bubbleGraphData = getDataForGraph(selVal, "bubble");

        let bubbleTrace = {
            x: bubbleGraphData[0],
            y: bubbleGraphData[1],
            text: bubbleGraphData[2],
            mode: 'markers',
            marker: {
                size: bubbleGraphData[1],
                color: bubbleGraphData[0]
            }
        };

        let bubbleData = [bubbleTrace];
        let bubbleLayout = {
            title: "Bubble Chart for the Samples"
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    }
});

/*
* Function invoked on selecting a subject id from the drop down
* Accepts the selected subject id and replots the bar and the bubble chart
* 
*/

function optionChanged(value){

    console.log(`Now the selected value is ${value}`);
   
    let barGraphData = getDataForGraph(value, "bar");
    let bubbleGraphData = getDataForGraph(value, "bubble");

    //repolot the bar graph
    Plotly.restyle("bar", "x", [barGraphData[1]])
    Plotly.restyle("bar", "y", [barGraphData[0].map((otu_id) => `OTU ${otu_id}`)])
    Plotly.restyle("bar", "text", [barGraphData[2]])
    //console.log(barGraphData);

    //repolot the bubble graph
    Plotly.restyle("bubble", "x", [bubbleGraphData[0]])
    Plotly.restyle("bubble", "y", [bubbleGraphData[1]])
    Plotly.restyle("bubble", "text", [bubbleGraphData[2]])

}
/*
* Function to get the sample data for the selected id
* Accepts all the samples in the dataset and the selected sample id
* Returns a Sample array
*/
function getTheValuesForSelectedSample(samples, selVal){
    for (let i = 0; i < samples.length; i++){
        sample = samples[i]

        if (sample.id == selVal) return sample;
    }
}

/*
* Function to get the data to plot the bar and the bubble graphs for the selected id
* Accepts the selected sample id and the string indicating the type of the chart (bar or bubble)
* Returns a list of array
*/
function getDataForGraph(selVal, charType){
    let graphData = [];
    
    //Get the selected sample data
    sample = getTheValuesForSelectedSample(samples, selVal);

    let otu_ids = [];
    let sample_values = [];
    let otu_labels = [];

    //Select the OTU IDS for the selected value in the drop down
    if (charType === "bar"){
        otu_ids = (sample.otu_ids).slice(0, 10).reverse();
        sample_values = (sample.sample_values).slice(0, 10).reverse();
        otu_labels = (sample.otu_labels).slice(0, 10).reverse();
        
    } else {
        otu_ids = (sample.otu_ids);
        sample_values = (sample.sample_values);
        otu_labels = (sample.otu_labels);

    }
    graphData.push(otu_ids);
    graphData.push(sample_values);
    graphData.push(otu_labels);
    return graphData;
    
}

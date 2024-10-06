import * as THREE from '/modules/three.module.js';

let currentDataSource = null;

const earthTextureUrl = '/images/earth-blue-marble.jpg';

// Predefined data sources with tags
const dataSources = {
    "xco2": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/08f476b6d4343d87fce86fc20989abcb/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=xco2&colormap_name=magma&rescale=412%2C422',
        tags: "both"
    },
    "nbe": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=lnlgis-nbe&colormap_name=coolwarm&rescale=-1200%2C1200',
        tags: "both"
    },
    "nce": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=lnlgis-nce&colormap_name=coolwarm&rescale=-1200%2C1200',
        tags: "both"
    },
    "nlcsl": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=lnlgis-dc-loss&colormap_name=coolwarm&rescale=-600%2C600',
        tags: "both"
    },
    "crop": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=crop&colormap_name=coolwarm&rescale=-100%2C100',
        tags: "human-caused emissions"
    },
    "ffcem": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=ff&colormap_name=purd&rescale=0%2C450',
        tags: "human-caused emissions"
    },
    "river": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=river&colormap_name=coolwarm&rescale=-50%2C50',
        tags: "human-caused emissions"
    },
    "wood": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/4489b3adb44d1cdf07fdeb0da20380b1/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=wood&colormap_name=coolwarm&rescale=-100%2C100',
        tags: "human-caused emissions"
    },
    "co2": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/c5aeaef15499f4f521b198f8a48841c8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=co2-emissions&colormap_name=jet&rescale=-10%2C60',
        tags: "human-caused emissions"
    },
    "npp": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=npp&colormap_name=purd&rescale=0%2C8',
        tags: "natural sources and sinks"
    },
    "rh": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=rh&colormap_name=purd&rescale=0%2C8',
        tags: "natural sources and sinks"
    },
    "nee": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=nee&colormap_name=coolwarm&rescale=-4%2C4',
        tags: "natural sources and sinks"
    },
    "rffn": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=nbe&colormap_name=coolwarm&rescale=-4%2C4',
        tags: "natural sources and sinks"
    },
    "fire": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=fire&colormap_name=purd&rescale=0%2C8',
        tags: "natural sources and sinks"
    },
    "woodfuel": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=fuel&colormap_name=purd&rescale=0%2C0.5',
        tags: "human-caused emissions"
    },
    "wetlandch4": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/ac178c9e3d4f069d1334475c7febad34/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=ensemble-mean-ch4-wetlands-emissions&colormap_name=magma&rescale=0%2C3e-9',
        tags: "natural sources and sinks"
    },
    "airsea": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/e38c1b6e8f3e8f32154dab2e8bbd4e86/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=co2&colormap_name=bwr&rescale=-0.0007%2C0.0002',
        tags: "natural sources and sinks"
    },
    "priori": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/17feb26d25fd90ad87845406aba9955e/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=prior-total&colormap_name=spectral_r&rescale=0%2C0.3',
        tags: "natural sources and sinks"
    },
    "posterior": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/17feb26d25fd90ad87845406aba9955e/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=post-total&colormap_name=spectral_r&rescale=0%2C0.3',
        tags: "natural sources and sinks"
    },
    "totch4": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/ac83329cc2fe54db02348d6dac313dbc/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=total&colormap_name=purd&rescale=0.48%2C24',
        tags: "both,ch4"
    },
    "microch4": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/ac83329cc2fe54db02348d6dac313dbc/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=microbial&colormap_name=purd&rescale=0.3%2C15',
        tags: "both,ch4"
    },
    "ffch4": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/ac83329cc2fe54db02348d6dac313dbc/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=fossil&colormap_name=purd&rescale=0.24%2C12',
        tags: "human-caused emissions,ch4"
    },
    "pyroch4": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/ac83329cc2fe54db02348d6dac313dbc/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=pyrogenic&colormap_name=purd&rescale=0.032%2C1.6',
        tags: "both,ch4"
    },
    "pop": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/822d8911ace54263c201fffc56d8e752/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=population-density&colormap_name=ylorrd&rescale=0%2C1000',
        tags: "pop"
    },
}; // [change]2

let currentResolution = '1';

// Function to load tiles for a given data source and resolution
function loadTiles(dataSourceKey, resolution) {
    const tileUrlTemplate = dataSources[dataSourceKey].url.replace('@1x', `@${resolution}x`);

    const zoomLevel = 2;
    const numCols = Math.pow(2, zoomLevel);
    const numRows = numCols;
    const tilesData = [];

    const tileWidth = 360 / numCols;
    const tileHeight = 360 / numRows;

    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
            const lng = -135 + (col * tileWidth); // Longitude from -180 to 180
            const lat = 135 - (row * tileHeight); // Latitude from 90 to -90

            tilesData.push({
                lng: lng,
                lat: lat,
                tileUrl: tileUrlTemplate
                    .replace('{TileMatrix}', zoomLevel)
                    .replace('{TileCol}', col)
                    .replace('{TileRow}', row),
                material: new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(tileUrlTemplate
                        .replace('{TileMatrix}', zoomLevel)
                        .replace('{TileCol}', col)
                        .replace('{TileRow}', row)),
                    opacity: 0.8,
                    transparent: true
                })
            });
        }
    }

    // Update the globe with the new tiles
    globe
        .tilesData(tilesData)
        .tileWidth(tileWidth)
        .tileHeight(tileHeight)
        .tileMaterial('material');
}

// Create the Globe with Earth texture as the base
const globe = Globe()
    .globeImageUrl(earthTextureUrl) // Set the Earth texture here
    .tileWidth(360 / Math.pow(2, 2)) // Set default tileWidth
    .tileHeight(360 / Math.pow(2, 2)) // Set default tileHeight
    .tileMaterial('material');

window.addEventListener('resize', (event) => {
    globe.width([event.target.innerWidth])
    globe.height([event.target.innerHeight])
});

// Render the globe
globe(document.getElementById('globeViz'));

// Event listener for resolution slider
document.getElementById('resolutionSlider').addEventListener('input', (event) => {
    const resolution = event.target.value;
    currentResolution = resolution;
    var restext = `Current: ${resolution}x`
    if (currentResolution == 4) {
        restext = restext + " [Warning: Slow!]"
    }
    document.getElementById('resolutionValue').innerText = restext;

    // Reload tiles with the new resolution using the stored current data source
    if (currentDataSource) {
        loadTiles(currentDataSource, resolution);
    }
});

// Event listener for tag selection
document.getElementById('tags').addEventListener('change', (event) => {
    const selectedTag = event.target.value;
    const dataButtons = document.querySelectorAll('.data-btn');

    // Show or hide buttons based on the selected tag
    dataButtons.forEach(btn => {
        const dataTags = btn.getAttribute('data-tag').split(',');
        if (selectedTag === 'all' || dataTags.includes(selectedTag)) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });
});

// Event listener for data source buttons
document.querySelectorAll('.data-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        currentDataSource = event.target.getAttribute('data-source'); // Set current data source
        loadTiles(currentDataSource, currentResolution);

        // Update the map info
        document.getElementById('mapInfo').innerHTML = mapInformation[currentDataSource] || "No information available.";
    });
});


const mapInformation = {
    "xco2": `NASA &middot; Global &middot; Daily &middot; ppm<br>
<br>
Daily dry air column-averaged mole fractions of carbon dioxide created from data assimilations of OCO-2 satellite retrievals.<br>
<br>
Temporal Extent: January 1, 2015 - February 28, 2022<br>
Temporal Resolution: Daily<br>
Spatial extent: Global<br>
Spatial resolution: 0.5&deg; x 0.625&deg;<br>
Data units: Parts per million (ppm)<br>
Data type: Research<br>
Data Latency: 2-3 months
<br><h6>Legend</h2><div id="xco2"></div><span>412</span><span style="float:right">422</span>`,
    "nbe": `NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from net flux of carbon from terrestrial biosphere to atmosphere (net biosphere exchange) estimated from the OCO-2 v10 MIP LNLGIS ensemble<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="nbe"></div><span>-1,200</span><span style="float:right">1,200</span>`,
    "nce": `NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from net flux of carbon from surface to atmosphere (net carbon exchange) estimated from the OCO-2 v10 MIP LNLGIS ensemble<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="nce"></div><span>-1,200</span><span style="float:right">1,200</span>`,
    "nlcsl": `NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from net land carbon stock loss (decrease in land carbon) estimated from the OCO-2 v10 MIP LNLGIS ensemble<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="nlcsl"></div><span>-600</span><span style="float:right">600</span>`,
    "crop": `NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from lateral flux of carbon in (positive) or out (negative) from crops<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="crop"></div><span>-100</span><span style="float:right">100</span>`,
    "ffcem": `NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from the burning of fossil fuels and release of carbon due to cement production (positive flux from land surface to the atmosphere)<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="ffcem"></div><span>0</span><span style="float:right">450</span>`,
    "river": `NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from lateral flux of carbon in (positive) or out (negative) from rivers<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="river"></div><span>-50</span><span style="float:right">50</span>`,
    "wood": `Lateral Wood CO&#8322; Flux (Wood)<br>
NASA / NOAA &middot; Global &middot; Annual &middot; g CO&#8322;/m&sup2;/yr<br>
<br>
CO&#8322; emissions from lateral flux of carbon due to wood product harvesting and usage<br>
<br>
Temporal Extent: 2015 &ndash; 2020<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of carbon dioxide per square meter per year (g CO&#8322;/m&sup2;/yr)<br>
Data Type: Research<br>
Data Latency: N/A
<br><h6>Legend</h2><div id="wood"></div><span>-100</span><span style="float:right">100</span>`,
    "co2": `NASA / NIES &middot; Global &middot; Monthly &middot; tonne C/km&sup2;/month<br>
<br>
Model-estimated monthly, 1 km CO&#8322; emissions created using space-based nighttime light data and individual power plant emission/location profiles.<br>
<br>
Temporal Extent: January 2000 - December 2022<br>
Temporal Resolution: Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: 1 km x 1 km<br>
Data Units: Metric tonnes of carbon per 1 km x 1 km cell per month (tonne C/km&sup2;/month)<br>
Data Type: Research<br>
Data Latency: Updated annually, following the release of an updated BP Statistical Review of World Energy report
<br><h6>Legend</h2><div id="co2"></div><span>-10</span><span style="float:right">60</span>`,
    "npp": `NASA &middot; Global &middot; Monthly &middot; g Carbon/m&sup2;/day<br>
<br>
Model-estimated net primary production (NPP), which is the rate at which plants produce and store carbon that is available to the ecosystem (biomass increase)<br>
<br>
Temporal Extent: January 1, 2001 - December 31, 2023<br>
Temporal Resolution: Daily and Monthly Averages<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.1&deg; x 0.1&deg;<br>
Data Units: Grams of Carbon per square meter per day (g Carbon/m&sup2;/day)<br>
Data Type: Research<br>
Data Latency: Less than a year, typically 6 months
<br><h6>Legend</h2><div id="npp"></div><span>0</span><span style="float:right">8</span>`,
    "rh": `NASA &middot; Global &middot; Monthly &middot; g Carbon/m&sup2;/day<br>
<br>
Model-estimated heterotrophic respiration (Rh), which is the flux of carbon from the soil to the atmosphere<br>
<br>
Temporal Extent: January 1, 2001 - December 31, 2023<br>
Temporal Resolution: Daily and Monthly Averages<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.1&deg; x 0.1&deg;<br>
Data Units: Grams of Carbon per square meter per day (g Carbon/m&sup2;/day)<br>
Data Type: Research<br>
Data Latency: Less than a year, typically 6 months
<br><h6>Legend</h2><div id="rh"></div><span>0</span><span style="float:right">8</span>`,
    "nee": `NASA &middot; Global &middot; Monthly &middot; g Carbon/m&sup2;/day<br>
<br>
Model-estimated net ecosystem exchange (NEE), which is the net carbon flux to the atmosphere from the ecosystem (Rh - NPP)<br>
<br>
Temporal Extent: January 1, 2001 - December 31, 2023<br>
Temporal Resolution: Daily and Monthly Averages<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.1&deg; x 0.1&deg;<br>
Data Units: Grams of Carbon per square meter per day (g Carbon/m&sup2;/day)<br>
Data Type: Research<br>
Data Latency: Less than a year, typically 6 months
<br><h6>Legend</h2><div id="nee"></div><span>-4</span><span style="float:right">4</span>`,
    "rffn": `NASA &middot; Global &middot; Monthly &middot; g Carbon/m&sup2;/day<br>
<br>
Model-estimated net biosphere exchange (NBE), which is the net carbon flux to the atmosphere from the ecosystem, taking into account wildfire and wood fuel burning sources of carbon (Rh + FIRE + FUEL - NPP)<br>
<br>
Temporal Extent: January 1, 2001 - December 31, 2023<br>
Temporal Resolution: Daily and Monthly Averages<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.1&deg; x 0.1&deg;<br>
Data Units: Grams of Carbon per square meter per day (g Carbon/m&sup2;/day)<br>
Data Type: Research<br>
Data Latency: Less than a year, typically 6 months
<br><h6>Legend</h2><div id="nbe"></div><span>-4</span><span style="float:right">4</span>`,
    "fire": `NASA &middot; Global &middot; Monthly &middot; g Carbon/m&sup2;/day<br>
<br>
Model-estimated flux of carbon to the atmosphere from wildfires<br>
<br>
Temporal Extent: January 1, 2001 - December 31, 2023<br>
Temporal Resolution: Daily and Monthly Averages<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.1&deg; x 0.1&deg;<br>
Data Units: Grams of Carbon per square meter per day (g Carbon/m&sup2;/day)<br>
Data Type: Research<br>
Data Latency: Less than a year, typically 6 months
<br><h6>Legend</h2><div id="fire"></div><span>0</span><span style="float:right">8</span>`,
    "woodfuel": `NASA &middot; Global &middot; Monthly &middot; g Carbon/m&sup2;/day<br>
<br>
Model-estimated flux of carbon to the atmosphere from wood burned for fuel<br>
<br>
Temporal Extent: January 1, 2001 - December 31, 2023<br>
Temporal Resolution: Daily and Monthly Averages<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.1&deg; x 0.1&deg;<br>
Data Units: Grams of Carbon per square meter per day (g Carbon/m&sup2;/day)<br>
Data Type: Research<br>
Data Latency: Less than a year, typically 6 months
<br><h6>Legend</h2><div id="woodfuel"></div><span>0</span><span style="float:right">0.5</span>`,
    "wetlandch4": `NASA &middot; Global &middot; Monthly &middot; kg CH&#8324;/m&sup2;/s<br>
<br>
Monthly CH&#8324; emissions from wetlands constructed using an ensemble of climate forcing data sources input to the LPJ-EOSIM model (mean of ERA5 and MERRA-2 layers)<br>
<br>
Temporal Extent: January 1, 1990 - ongoing<br>
Temporal Resolution: Daily and Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: 0.5&deg; x 0.5&deg;<br>
Data Units: Kilograms of methane per meter squared per second (kg CH&#8324;/m&sup2;/s)<br>
Data Type: Research<br>
Data Latency: Updated once every two months
<br><h6>Legend</h2><div id="wetlandch4"></div><span>0</span><span style="float:right">3x10⁻⁹</span>`,
    "airsea": `NASA &middot; Global &middot; Monthly &middot; mmol m&sup2;/s<br>
<br>
Monthly mean air-sea CO&#8322; Flux (negative into ocean)<br>
<br>
Temporal Extent: January 2020 - December 2022<br>
Temporal Resolution: Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: Approximately 1/3&deg; x 1/3&deg; (at the equator)<br>
Data Units: Millimoles of CO&#8322; per meter squared per second (mmol m&sup2;/s)<br>
Data Type: Research<br>
Data Latency: Updated annually
<br><h6>Legend</h2><div id="airsea"></div><span>-7x10⁻⁴</span><span style="float:right">7x10⁻⁴</span>`,
    "priori": `NASA &middot; Global &middot; Annual &middot; Tg CH&#8324;/yr<br>
<br>
Total methane emissions per grid cell derived from the GEOS-Chem global chemistry transport model<br>
<br>
Temporal Extent: 2019<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Teragrams of methane per year (Tg CH&#8324;/yr)<br>
Data Type: Research<br>
Data Latency: Updated yearly
<br><h6>Legend</h2><div id="priori"></div><span>0</span><span style="float:right">0.3</span>`,
    "posterior": `NASA &middot; Global &middot; Annual &middot; Tg CH&#8324;/yr<br>
<br>
Total methane emissions per grid cell derived using GOSAT data in the GEOS-Chem global chemistry transport model<br>
<br>
Temporal Extent: 2019<br>
Temporal Resolution: Annual<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Teragrams of methane per year (Tg CH&#8324;/yr)<br>
Data Type: Research<br>
Data Latency: Updated yearly
<br><h6>Legend</h2><div id="posterior"></div><span>0</span><span style="float:right">0.3</span>`,
    "totch4": `NASA / NOAA &middot; Global &middot; Monthly &middot; g CH&#8324;/m&sup2;/year<br>
<br>
Total methane emission from microbial, fossil and pyrogenic sources.<br>
<br>
Temporal Extent: January 1999 - December 2016<br>
Temporal Resolution: Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of methane per square meter per year (g CH&#8324;/m&sup2;/year)<br>
Data Type: Research<br>
Data Latency: Approximately 2 years
<br><h6>Legend</h2><div id="totch4"></div><span>0.48</span><span style="float:right">24</span>`,
    "microch4": `NASA / NOAA &middot; Global &middot; Monthly &middot; g CH&#8324;/m&sup2;/year<br>
<br>
Emission of methane from all microbial sources, such as wetlands, agriculture and termites.<br>
<br>
Temporal Extent: January 1999 - December 2016<br>
Temporal Resolution: Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of methane per square meter per year (g CH&#8324;/m&sup2;/year)<br>
Data Type: Research<br>
Data Latency: Approximately 2 years
<br><h6>Legend</h2><div id="microch4"></div><span>0.3</span><span style="float:right">15</span>`,
    "ffch4": `NASA / NOAA &middot; Global &middot; Monthly &middot; g CH&#8324;/m&sup2;/year<br>
<br>
Emission of methane from all fossil sources, such as oil and gas activities and coal mining.<br>
<br>
Temporal Extent: January 1999 - December 2016<br>
Temporal Resolution: Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of methane per square meter per year (g CH&#8324;/m&sup2;/year)<br>
Data Type: Research<br>
Data Latency: Approximately 2 years
<br><h6>Legend</h2><div id="ffch4"></div><span>0.24</span><span style="float:right">12</span>`,
    "pyroch4": `NASA / NOAA &middot; Global &middot; Monthly &middot; g CH&#8324;/m&sup2;/year<br>
<br>
Emission of methane from all sources of biomass burning, such as wildfires and crop residue burning.<br>
<br>
Temporal Extent: January 1999 - December 2016<br>
Temporal Resolution: Monthly<br>
Spatial Extent: Global<br>
Spatial Resolution: 1&deg; x 1&deg;<br>
Data Units: Grams of methane per square meter per year (g CH&#8324;/m&sup2;/year)<br>
Data Type: Research<br>
Data Latency: Approximately 2 years
<br><h6>Legend</h2><div id="pyroch4"></div><span>0.032</span><span style="float:right">1.6</span>`,
    "pop": `NASA &middot; Global &middot; Annual &middot; persons/km&sup2;<br>
<br>
Gridded population density estimates for the years 2000, 2005, 2010, 2015, and 2020 from Gridded Population of the World (GPW) version 4, revision 11<br>
<br>
Temporal Extent: 2000 - 2020<br>
Temporal Resolution: Annual, every 5 years<br>
Spatial Extent: Global<br>
Spatial Resolution: 30 arc-seconds (~1 km at equator)<br>
Data Units: Number of persons per square kilometer (persons/km&sup2;)<br>
Data Type: Research<br>
Data Latency: 5 years
<br><h6>Legend</h2><div id="pop"></div><span>0</span><span style="float:right">1,000</span>`,
};
// [change]3

// Event listener for data source buttons to update map info
document.querySelectorAll('.data-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const selectedDataSource = event.target.getAttribute('data-source');
        loadTiles(selectedDataSource, currentResolution);

        // Update the map info
        document.getElementById('mapInfo').innerHTML = mapInformation[selectedDataSource] || "No information available.";
    });
});


import * as THREE from '//unpkg.com/three/build/three.module.js';

const earthTextureUrl = 'https://unpkg.com/three-globe@2.32.0/example/img/earth-blue-marble.jpg';

// Predefined data sources with tags
const dataSources = {
    "co2-emissions": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/37b846993d10ef3d9fd846d10bfb8885/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}{Resolution}.png?assets=co2-emissions&colormap_name=jet&rescale=-10%2C60',
        tags: "human-caused emissions"
    },
    "xco2": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/08f476b6d4343d87fce86fc20989abcb/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}{Resolution}.png?assets=xco2&colormap_name=magma&rescale=412%2C422',
        tags: "human-caused emissions"
    },
    "npp": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/055e09c82bf81d02ee96be8565f5bcb8/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}{Resolution}.png?assets=npp&colormap_name=purd&rescale=0%2C8',
        tags: "natural sources and sinks"
    },
    "priori": {
        url: 'https://earth.gov/ghgcenter/api/raster/searches/17feb26d25fd90ad87845406aba9955e/tiles/WebMercatorQuad/{TileMatrix}/{TileCol}/{TileRow}@1x.png?assets=prior-total&colormap_name=spectral_r&rescale=0%2C0.3',
        tags: "natural sources and sinks"
    }
};

let currentResolution = '1';

// Function to load tiles for a given data source and resolution
function loadTiles(dataSourceKey, resolution) {
    const tileUrlTemplate = dataSources[dataSourceKey].url.replace('{Resolution}', `@${resolution}x`);

    const zoomLevel = 2;
    const numCols = Math.pow(2, zoomLevel);
    const numRows = numCols;
    const tilesData = [];

    const tileWidth = 360 / numCols;
    const tileHeight = 360 / numRows; // Fixed height to maintain aspect ratio

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

// Render the globe
globe(document.getElementById('globeViz'));

// Event listener for resolution slider
document.getElementById('resolutionSlider').addEventListener('input', (event) => {
    const resolution = event.target.value;
    currentResolution = resolution;
    document.getElementById('resolutionValue').innerText = `${resolution}x`;

    // Reload tiles with the new resolution
    const activeButton = document.querySelector('.data-btn:not(.hidden)');
    if (activeButton) {
        const selectedDataSource = activeButton.getAttribute('data-source');
        loadTiles(selectedDataSource, resolution);
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
        const selectedDataSource = event.target.getAttribute('data-source');
        loadTiles(selectedDataSource, currentResolution);
    });
});

// Initial load with CO₂ Emissions
loadTiles('co2-emissions', currentResolution);
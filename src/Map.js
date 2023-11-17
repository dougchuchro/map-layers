import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import './css/Map.css';
import ShowHotelsCheckbox from "./components/ShowHotelsCheckbox";
import GapJapanStores from './data/GapJapanStoreAddress.json';

import brIcon from "./img/BR-icon.png";
import brfsIcon from "./img/BRFS-icon.png";
import fitIcon from "./img/Fit-icon.png";
import gapIcon from "./img/Gap-icon.png";
import gfsIcon from "./img/GFS-icon.png";
import ggIcon from "./img/GG-icon.png";
import goIcon from "./img/GO-icon.png";
import StoresList from "./components/StoresList";
const imgArray = [
    { id: 'br-ico', url: brIcon },
    { id: 'brfs-ico', url: brfsIcon },
    { id: 'fit-ico', url: fitIcon },
    { id: 'gap-ico', url: gapIcon },
    { id: 'gfs-ico', url: gfsIcon },
    { id: 'gg-ico', url: ggIcon },
    { id: 'go-ico', url: goIcon }
];
// Gap Japan Stores JSON file to stores array
const stores = GapJapanStores.features;
// Parse store data to great a list of all Brands
const brandsMap = new Map(stores.map(store => [store.properties.BRAND_CODE, { brandName: store.properties.BRAND, display: true }]));
// Add the Store Count to each brand
brandsMap.forEach((brand, key, map) => {
  brand.storeCount = (stores.filter(s => s.properties.BRAND_CODE === key).length);
  brandsMap.set(key, brand);
});
console.log("Brands Filter Map: ");
console.log(brandsMap);

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const MbxMap = () => {
    const mapContainer = useRef()
    const [showHotels, setShowHotels] = useState(true);
    const [map, setMap] = useState(null);
    const [brands, setBrands ] = useState(brandsMap);

    function handleClick() {
        setShowHotels(!showHotels);
    };

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [139.75389841952335, 35.68375698300295],
            zoom: 6,
            pitch: 30,
            bearing: 0,
        })

        map.on("load", () => {

            // add mapbox terrain dem source for 3d terrain rendering
            map.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxZoom: 16,
            })
            map.setTerrain({ source: "mapbox-dem" })

/*             map.addSource("snotel-sites", {
                type: "geojson",
                data: SnotelSites,
            })
 */
            map.addSource("gap-japan-stores", {
                type: "geojson",
                data: GapJapanStores,
            })

            // snotel sites - circle layer
            // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle

/*             map.addLayer({
                id: "snotel-sites-circle",
                type: "circle",
                source: "snotel-sites",
                paint: {
                    "circle-color": "#1d1485",
                    "circle-radius": 8,
                    "circle-stroke-color": "#ffffff",
                    "circle-stroke-width": 2,
                },
            }) */

            // snotel sites - label layer
            // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol

/*             map.addLayer({
                id: "snotel-sites-label",
                type: "symbol",
                source: "snotel-sites",
                layout: {
                    "text-field": ["get", "Station Name"],
                    "text-size": 16,
                    "text-offset": [0, -1.5],
                },
                paint: {
                    "text-color": "#1d1485",
                    "text-halo-color": "#ffffff",
                    "text-halo-width": 0.5,
                },
            }) */

            Promise.all(
                imgArray.map(img => new Promise((resolve, reject) => {
                    map.loadImage(img.url, function (error, res) {
                        map.addImage(img.id, res)
                        resolve();
                    })
                }))
            ).then(() => {
                map.addLayer({
                    id: "gap-japan-stores",
                    type: "symbol",
                    source: "gap-japan-stores",
                    'layout': {
                        'icon-size': 0.5,
                        'icon-image': [
                            'match',
                            ['get', 'BRAND_CODE'],
                            'BR', 'br-ico',
                            'BRFS', 'brfs-ico',
                            'Fit', 'fit-ico',
                            'Gap', 'gap-ico',
                            'GFS', 'gfs-ico',
                            'GG', 'gg-ico',
                            'GO', 'go-ico',
                            'gap-ico'
                        ]
                    },
                });
                setMap(map);
            })
        })
        // cleanup function to remove map on unmount
        return () => map.remove()
    }, [])

/*     useEffect(() => {
        paint();
        // eslint-disable-next-line
    }, [showHotels]);

    const paint = () => {
        if (map) {
            if (showHotels) {
                console.log("remove filter");
                map.setFilter('snotel-sites-circle', null);
                map.setFilter('snotel-sites-label', null);
            } else {
                console.log("add filter");
                // display only features with five or more 'available-spots'
                map.setFilter('snotel-sites-circle', ['==', ['get', 'Station Id'], '0']);
                map.setFilter('snotel-sites-label', ['==', ['get', 'Station Id'], '0']);
            }
        }
    }; */

    return (
        <div>
            <div className='sidebarStyle'>
                <div>
                    <p>Is "Show Hotels?" checked? {showHotels.toString()}</p>
                </div>
                <ShowHotelsCheckbox showHotels={showHotels} onClick={handleClick} />
            </div>
            <div className='sidebarStyle'>
                <StoresList stores={stores} brandsMap={brands} />
            </div>
            <div className='map-container' ref={mapContainer} />
        </div>
    )
}

export default MbxMap;

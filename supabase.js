mapboxgl.accessToken =
  "pk.eyJ1IjoiamVyb21lLTEiLCJhIjoiY2xucXZidnRqMHZ5ZzJrcXRiNHFoMWVmZiJ9.6sfYi9c8KmhIfs83DaP9Iw";

/**
 * Add the map to the page
 */
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [120.97789263203397, 14.590221953177776],
  zoom: 17,
  scrollZoom: true,
});

const stores = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97614761438649, 14.590669690701768],
      },
      properties: {
        storename: "Chibz Restobar",
        storedescription:
          "Where Great Memoeries are Made, and Shared, Through a Drink!!",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97863729514305, 14.591330144376444],
      },
      properties: {
        storename: "Tea N' Dough Intramuros",
        storedescription: "Steeped in History, Served with Delights.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97868622644344, 14.591085914009927],
      },
      properties: {
        storename: "JDM PARES MAMI HOUSE",
        storedescription: "Savoring Authentic Filipino Flavors, JDM Style.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97865068717624, 14.591209209885344],
      },
      properties: {
        storename: "Lav Cafe",
        storedescription: "Sip Elegance, One Cup at Lav.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97857223256351, 14.59140258959664],
      },
      properties: {
        storename: "VJ's Double Fried Chicken",
        storedescription: "Double the Flavor, Double the Crispiness.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97852857782586, 14.591431043083901],
      },
      properties: {
        storename: "EggStop Intramuros",
        storedescription: "Egg-ceptional Intramuros Stop for Breakfast Lovers.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.978033, 14.591147],
      },
      properties: {
        storename: "Kantunan sa Intramuros",
        storedescription:
          "Intramuros' Flavor Haven, Kantunan's Culinary Delights.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97709560763519, 14.59056813358938],
      },
      properties: {
        storename: "Pepito's Food House",
        storedescription: "Intramuros' House of Delights, House of Fun",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.978802, 14.589644],
      },
      properties: {
        storename: "Paresan ni Kuya",
        storedescription: "Kuya's Paresan: Where Flavor and Frienship Start.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97740377943342, 14.589252672742367],
      },
      properties: {
        storename: "Banketa Plates",
        storedescription:
          "Intramuros' Bangketa Plates: Street Food Reimagined.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97740377943342, 14.589252672742367],
      },
      properties: {
        storename: "Banketa Plates",
        storedescription:
          "Intramuros' Bangketa Plates: Street Food Reimagined.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.97750743265571, 14.592493545518861],
      },
      properties: {
        storename: "Better Billiards Intramuros",
        storedescription:
          "Better Billiards: Intramuros' Premier Pool Paradise.",
      },
    },
  ],
};

/**
 * Assign a unique id to each store. You'll use this `id`
 * later to associate each point on the map with a listing
 * in the sidebar.
 */
stores.features.forEach((store, i) => {
  store.properties.id = i;
});

/**
 * Wait until the map loads to make changes to the map.
 */
map.on("load", () => {
  /**
   * This is where your '.addLayer()' used to be, instead
   * add only the source without styling a layer
   */
  map.addSource("places", {
    type: "geojson",
    data: stores,
  });

  /**
   * Add all the things to the page:
   * - The location listings on the side of the page
   * - The markers onto the map
   */
  buildLocationList(stores);
  addMarkers();
});

/**
 * Add a marker to the map for every store listing.
 **/
function addMarkers() {
  /* For each feature in the GeoJSON object above: */
  for (const marker of stores.features) {
    /* Create a div element for the marker. */
    const el = document.createElement("div");
    /* Assign a unique `id` to the marker. */
    el.id = `marker-${marker.properties.id}`;
    /* Assign the `marker` class to each marker for styling. */
    el.className = "marker";

    /**
     * Create a marker using the div element
     * defined above and add it to the map.
     **/
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

    /**
     * Listen to the element and when it is clicked, do three things:
     * 1. Fly to the point
     * 2. Close all other popups and display popup for clicked store
     * 3. Highlight listing in sidebar (and remove highlight for all other listings)
     **/
    el.addEventListener("click", (e) => {
      /* Fly to the point */
      flyToStore(marker);
      /* Close all other popups and display popup for clicked store */
      createPopUp(marker);
      /* Highlight listing in sidebar */
      const activeItem = document.getElementsByClassName("active");
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      const listing = document.getElementById(
        `listing-${marker.properties.id}`
      );
      listing.classList.add("active");
    });
  }
}

/**
 * Add a listing for each store to the sidebar.
 **/
function buildLocationList(stores) {
  for (const store of stores.features) {
    /* Add a new listing section to the sidebar. */
    const listings = document.getElementById("listings");
    const listing = listings.appendChild(document.createElement("div"));
    /* Assign a unique `id` to the listing. */
    listing.id = `listing-${store.properties.id}`;
    /* Assign the `item` class to each listing for styling. */
    listing.className = "item";

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement("a"));
    link.href = "#";
    link.className = "title";
    link.id = `link-${store.properties.id}`;
    link.innerHTML = `${store.properties.storename}`;

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement("div"));
    details.innerHTML = `${store.properties.storedescription}`;

    /**
     * Listen to the element and when it is clicked, do four things:
     * 1. Update the `currentFeature` to the store associated with the clicked link
     * 2. Fly to the point
     * 3. Close all other popups and display popup for clicked store
     * 4. Highlight listing in sidebar (and remove highlight for all other listings)
     **/
    link.addEventListener("click", function () {
      for (const feature of stores.features) {
        if (this.id === `link-${feature.properties.id}`) {
          flyToStore(feature);
          createPopUp(feature);
        }
      }
      const activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      this.parentNode.classList.add("active");
    });
  }
}

/**
 * Use Mapbox GL JS's `flyTo` to move the camera smoothly
 * a given center point.
 **/
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 18,
  });
}

/**
 * Create a Mapbox GL JS `Popup`.
 **/
function createPopUp(currentFeature) {
  const popUps = document.getElementsByClassName("mapboxgl-popup");
  if (popUps[0]) popUps[0].remove();
  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
      `<h3>${currentFeature.properties.storename}</h3><h4>${currentFeature.properties.storedescription}</h4>`
    )
    .addTo(map);
}

const objectTypes = [
  {
    id: "environment-evidence-bundle",
    name: "Environment Evidence Bundle",
    schemaName: "environment_evidence_bundle",
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Environment",
    sensitivity: "Standard",
    depth: "High depth",
    status: "Read-only",
    fields: 16,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description:
      "Reviewable bundle of environmental observations, state windows, dose vectors, actions, endpoints, measurement bindings, and World Model joins.",
    useWhen:
      "Use this record type when a governed environmental proof package needs to be reviewed as one bundle.",
    needs:
      "Provide source evidence and pass validation before review. Eleven required schema fields are enforced.",
    nextAction:
      "Review the type and validation detail. Proposal access is available from the action bar.",
    evidence:
      "Observation refs, endpoint refs, state window refs, and source files should be linked before validation.",
    fieldsList: [
      ["Id", "id", "textarea / required"],
      ["Trust", "trust", "textarea / required"],
      ["Domain", "domain", "text / required"],
      ["Status", "status", "textarea / required"],
      ["Version", "version", "textarea / required"],
      ["Governance", "governance", "textarea / required"],
      ["Action Refs", "action_refs", "textarea"],
      ["Object Type", "object_type", "text / required"],
      ["Bundle Scope", "bundle_scope", "enum / required"],
      ["Endpoint Refs", "endpoint_refs", "textarea"],
      ["Evidence Refs", "evidence_refs", "textarea / required"],
      ["Lifecycle State", "lifecycle_state", "textarea / required"],
      ["Dose Vector Refs", "dose_vector_refs", "textarea"],
      ["Observation Refs", "observation_refs", "textarea"],
      ["World Model Join", "world_model_join", "textarea / required"],
      ["State Window Refs", "state_window_refs", "textarea"]
    ]
  },
  {
    id: "environment-context-window",
    name: "Environment Context Window",
    schemaName: "environment_context_window",
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Environment",
    sensitivity: "Standard",
    depth: "High depth",
    status: "Read-only",
    fields: 17,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description:
      "A governed description of the conditions around an exposure: room, route, building, sleep setting, food-service context, and other local conditions.",
    useWhen:
      "Use this record type when an exposure or observation needs the surrounding conditions recorded as a bounded window.",
    needs:
      "A stable id, version, status, domain, lifecycle state, and linked evidence before it can be relied on.",
    nextAction:
      "Confirm the window boundary, attach source evidence, then run validation for required fields.",
    evidence:
      "Evidence can include photographs, environmental logs, measurement context, and location or route notes.",
    fieldsList: [
      ["Id", "id", "textarea / required"],
      ["Trust", "trust", "textarea / required"],
      ["Domain", "domain", "text / required"],
      ["Status", "status", "textarea / required"],
      ["Version", "version", "textarea / required"],
      ["Object Type", "object_type", "text / required"],
      ["Window Boundary", "window_boundary", "textarea / required"],
      ["Location Context", "location_context", "textarea"],
      ["Route Context", "route_context", "textarea"],
      ["Building Context", "building_context", "textarea"],
      ["Sleep Setting", "sleep_setting", "textarea"],
      ["Food Service Context", "food_service_context", "textarea"],
      ["Observation Refs", "observation_refs", "textarea"],
      ["Evidence Refs", "evidence_refs", "textarea / required"],
      ["Lifecycle State", "lifecycle_state", "textarea / required"],
      ["Governance", "governance", "textarea / required"],
      ["Notes", "notes", "textarea"]
    ]
  },
  {
    id: "environment-state-window",
    name: "Environment State Window",
    schemaName: "environment_state_window",
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Environment",
    sensitivity: "Standard",
    depth: "High depth",
    status: "Read-only",
    fields: 25,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description:
      "Time-linked environmental state across a measured window, including condition readings, observed changes, and state confidence.",
    useWhen:
      "Use this record type to place environmental state access inside a time window with explicit observations.",
    needs:
      "Thirteen required schema fields plus source evidence before review. Time window and state quality are mandatory.",
    nextAction:
      "Review state window timing, source coverage, and validation before proposing a linked record.",
    evidence:
      "Measurement feeds, timestamped notes, source instruments, and observation refs are expected.",
    fieldsList: [
      ["Id", "id", "textarea / required"],
      ["Domain", "domain", "text / required"],
      ["Status", "status", "textarea / required"],
      ["Version", "version", "textarea / required"],
      ["Object Type", "object_type", "text / required"],
      ["Window Start", "window_start", "datetime / required"],
      ["Window End", "window_end", "datetime / required"],
      ["State Summary", "state_summary", "textarea / required"],
      ["Measurement Binding", "measurement_binding", "textarea"],
      ["Observation Refs", "observation_refs", "textarea / required"],
      ["Evidence Refs", "evidence_refs", "textarea / required"],
      ["Confidence", "confidence", "enum / required"],
      ["Lifecycle State", "lifecycle_state", "textarea / required"]
    ]
  },
  {
    id: "food-supplement-context-window",
    name: "Food and Supplement Context Window",
    schemaName: "food_context_window",
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Food",
    sensitivity: "Standard",
    depth: "High depth",
    status: "Read-only",
    fields: 17,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description:
      "A governed description of source, preparation, delivery, storage, packaging, serving, consumption, or supplement context.",
    useWhen:
      "Use this record type when food or supplement exposure needs contextual proof around preparation or consumption.",
    needs:
      "A stable id, version, status, domain, lifecycle state, and source evidence before it can be used.",
    nextAction:
      "Attach preparation and source records, then validate required fields.",
    evidence:
      "Source labels, batch references, preparation notes, serving records, and storage evidence are expected.",
    fieldsList: [
      ["Id", "id", "textarea / required"],
      ["Domain", "domain", "text / required"],
      ["Status", "status", "textarea / required"],
      ["Object Type", "object_type", "text / required"],
      ["Source Context", "source_context", "textarea / required"],
      ["Preparation Context", "preparation_context", "textarea"],
      ["Delivery Context", "delivery_context", "textarea"],
      ["Storage Context", "storage_context", "textarea"],
      ["Packaging Context", "packaging_context", "textarea"],
      ["Serving Context", "serving_context", "textarea"],
      ["Consumption Context", "consumption_context", "textarea"],
      ["Supplement Context", "supplement_context", "textarea"],
      ["Evidence Refs", "evidence_refs", "textarea / required"]
    ]
  },
  {
    id: "human-context-window",
    name: "Human Context Window",
    schemaName: "human_context_window",
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Human",
    sensitivity: "Standard",
    depth: "High depth",
    status: "Read-only",
    fields: 21,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description:
      "Time-bounded human conditions that modify interpretation of an input, measurement, or response.",
    useWhen:
      "Use this record type when human state, setting, or context materially changes how an observation should be read.",
    needs:
      "Fifteen required schema fields plus source evidence before review.",
    nextAction:
      "Confirm the human context boundary, attach evidence, and validate all required fields.",
    evidence:
      "Consent-safe notes, session context, observed conditions, and measurement references should be attached.",
    fieldsList: [
      ["Id", "id", "textarea / required"],
      ["Domain", "domain", "text / required"],
      ["Status", "status", "textarea / required"],
      ["Object Type", "object_type", "text / required"],
      ["Context Boundary", "context_boundary", "textarea / required"],
      ["Condition Summary", "condition_summary", "textarea / required"],
      ["Observation Refs", "observation_refs", "textarea"],
      ["Evidence Refs", "evidence_refs", "textarea / required"],
      ["Lifecycle State", "lifecycle_state", "textarea / required"]
    ]
  },
  {
    id: "human-lifewindow",
    name: "Human LifeWindow",
    schemaName: "human_lifewindow",
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Human",
    sensitivity: "Standard",
    depth: "High depth",
    status: "Read-only",
    fields: 17,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description:
      "Governed time-bound human window with revision, membership, overlap, and supersession semantics.",
    useWhen:
      "Use this record type to represent a human life window that may be revised or superseded over time.",
    needs:
      "Thirteen required schema fields plus source evidence before review.",
    nextAction:
      "Check overlap and supersession rules before proposal or validation.",
    evidence:
      "Timeline records, membership history, supersession notes, and source evidence are required for review.",
    fieldsList: [
      ["Id", "id", "textarea / required"],
      ["Domain", "domain", "text / required"],
      ["Status", "status", "textarea / required"],
      ["Object Type", "object_type", "text / required"],
      ["Window Start", "window_start", "datetime / required"],
      ["Window End", "window_end", "datetime"],
      ["Membership", "membership", "textarea / required"],
      ["Overlap Rules", "overlap_rules", "textarea"],
      ["Supersession", "supersession", "textarea"],
      ["Evidence Refs", "evidence_refs", "textarea / required"],
      ["Lifecycle State", "lifecycle_state", "textarea / required"]
    ]
  }
];

const standardEnvironmentFields = [
  ["Id", "id", "textarea / required"],
  ["Domain", "domain", "text / required"],
  ["Status", "status", "textarea / required"],
  ["Version", "version", "textarea / required"],
  ["Object Type", "object_type", "text / required"],
  ["Window Start", "window_start", "datetime / required"],
  ["Window End", "window_end", "datetime"],
  ["Context Summary", "context_summary", "textarea / required"],
  ["Measurement Binding", "measurement_binding", "textarea"],
  ["Observation Refs", "observation_refs", "textarea"],
  ["Evidence Refs", "evidence_refs", "textarea / required"],
  ["Lifecycle State", "lifecycle_state", "textarea / required"],
  ["Governance", "governance", "textarea / required"]
];

function toObjectId(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toSchemaName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function makeEnvironmentObjectType(item) {
  return {
    id: toObjectId(item.name),
    name: item.name,
    schemaName: toSchemaName(item.name),
    area: "Evolve Intelligence Ontology",
    section: "Object Dossier",
    domain: "Environment",
    sensitivity: "Standard",
    depth: item.depth,
    status: item.status,
    fields: item.fields,
    records: 0,
    source: "Live service",
    snapshot: "Jun 17, 2026, 12:22",
    description: item.description,
    useWhen: `Use this record type when ${item.focus}.`,
    needs:
      "Provide a stable window boundary, lifecycle state, domain, source evidence, and validation-ready required fields before review.",
    nextAction: `Confirm ${item.name.toLowerCase()} timing, evidence coverage, and validation posture before proposal.`,
    evidence: item.evidence,
    fieldsList: standardEnvironmentFields
  };
}

const additionalEnvironmentObjectTypes = [
  {
    name: "Air Quality Monitoring Window",
    depth: "High depth",
    status: "Active",
    fields: 20,
    description: "Measured indoor or outdoor air quality across a bounded observation window.",
    focus: "air quality readings need to be reviewed with timing, location, and instrument context",
    evidence: "Sensor feeds, calibration notes, location logs, and pollutant readings should be linked."
  },
  {
    name: "Particulate Exposure Window",
    depth: "High depth",
    status: "Active",
    fields: 19,
    description: "Time-bound particulate exposure context for PM2.5, PM10, smoke, dust, or similar measurements.",
    focus: "particulate exposure needs explicit source, intensity, and duration context",
    evidence: "Particulate sensor data, source notes, weather context, and observation refs are expected."
  },
  {
    name: "Indoor Ventilation Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Ventilation state for rooms, buildings, openings, fans, and air exchange conditions.",
    focus: "indoor ventilation conditions modify how an environmental reading should be interpreted",
    evidence: "HVAC settings, room notes, window or fan state, and timestamped observations should be attached."
  },
  {
    name: "Outdoor Weather Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 15,
    description: "Local weather context that influences exposure, sampling quality, or environmental state.",
    focus: "weather conditions affect an observation, exposure, route, or sampling event",
    evidence: "Weather feeds, station refs, field notes, and geospatial context should be linked."
  },
  {
    name: "Surface Contamination Observation",
    depth: "High depth",
    status: "Active",
    fields: 18,
    description: "Observed or measured surface contamination across a governed area and time window.",
    focus: "surface contamination observations need material, area, sampling, and evidence context",
    evidence: "Swab results, photos, surface maps, cleaning logs, and chain-of-custody notes are expected."
  },
  {
    name: "Water Quality Sampling Window",
    depth: "High depth",
    status: "Active",
    fields: 21,
    description: "Water sampling context for quality measurements, collection conditions, and result interpretation.",
    focus: "water quality samples need source, collection method, timing, and measurement context",
    evidence: "Lab results, collection notes, source refs, temperature readings, and sample ids should be attached."
  },
  {
    name: "Soil Contact Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 15,
    description: "Context for contact with soil, sediment, ground cover, or tracked-in environmental material.",
    focus: "soil contact may affect environmental exposure or contamination interpretation",
    evidence: "Site notes, soil photos, sampling refs, activity logs, and location boundaries should be linked."
  },
  {
    name: "Noise Exposure Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Measured or observed noise exposure with level, source, duration, and setting context.",
    focus: "noise levels or acoustic events need a time-bounded environmental record",
    evidence: "Decibel readings, source notes, device refs, and occupancy context are expected."
  },
  {
    name: "Light Exposure Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Ambient or directed light exposure conditions across a space, route, or activity window.",
    focus: "light exposure changes observation quality, circadian context, or environmental interpretation",
    evidence: "Lux readings, source type, room notes, timestamps, and device refs should be linked."
  },
  {
    name: "Thermal Comfort Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 17,
    description: "Temperature and comfort context for a person, room, building, or outdoor setting.",
    focus: "thermal conditions need to be reviewed with activity, clothing, location, or equipment context",
    evidence: "Temperature feeds, comfort notes, HVAC state, and observation refs should be attached."
  },
  {
    name: "Humidity State Window",
    depth: "Focused depth",
    status: "Active",
    fields: 14,
    description: "Relative humidity state and related moisture conditions over a measured interval.",
    focus: "humidity levels influence air quality, mold risk, comfort, or material state",
    evidence: "Humidity readings, sensor refs, room context, and timestamped notes should be included."
  },
  {
    name: "Mold Risk Context",
    depth: "High depth",
    status: "Active",
    fields: 18,
    description: "Governed context for moisture, visible growth, odor, ventilation, and mold risk indicators.",
    focus: "mold risk needs connected moisture, ventilation, surface, and evidence context",
    evidence: "Photos, moisture readings, odor notes, inspection refs, and remediation records are expected."
  },
  {
    name: "Pollen Pressure Window",
    depth: "Focused depth",
    status: "Active",
    fields: 13,
    description: "Local pollen pressure and exposure context across a route, area, or observation window.",
    focus: "pollen context may explain environment-sensitive symptoms, measurements, or observations",
    evidence: "Pollen feeds, weather context, location notes, and activity windows should be linked."
  },
  {
    name: "Allergen Presence Observation",
    depth: "Moderate depth",
    status: "Active",
    fields: 15,
    description: "Observed allergen presence for dust, pets, pollen, mold, or other local triggers.",
    focus: "an allergen observation needs source, setting, confidence, and linked evidence",
    evidence: "Inspection notes, photos, sampling refs, and setting descriptions should be attached."
  },
  {
    name: "Chemical Vapor Exposure Window",
    depth: "High depth",
    status: "Active",
    fields: 22,
    description: "Time-linked vapor, odor, volatile compound, or chemical exposure context.",
    focus: "chemical vapor exposure requires source, concentration, duration, and safety context",
    evidence: "VOC readings, SDS refs, source notes, odor logs, and instrument evidence are expected."
  },
  {
    name: "Cleaning Product Use Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Context for cleaning products, application timing, area coverage, and ventilation state.",
    focus: "cleaning product use may modify indoor environmental readings or exposure interpretation",
    evidence: "Product labels, use logs, ventilation notes, surface refs, and photos should be linked."
  },
  {
    name: "Occupancy Density Window",
    depth: "Focused depth",
    status: "Active",
    fields: 14,
    description: "Occupancy count and density context for a room, venue, vehicle, or shared setting.",
    focus: "people count or density changes air, sound, thermal, or exposure interpretation",
    evidence: "Occupancy logs, access records, room capacity, and time-bounded observations are expected."
  },
  {
    name: "Building Material Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Building material context that may influence contaminants, emissions, dust, or exposure pathways.",
    focus: "material state or composition affects environmental measurement interpretation",
    evidence: "Material records, inspection notes, photos, age estimates, and location maps should be attached."
  },
  {
    name: "HVAC Operation State",
    depth: "Moderate depth",
    status: "Active",
    fields: 17,
    description: "Operational state for HVAC equipment, settings, schedule, mode, and local airflow effects.",
    focus: "HVAC state changes ventilation, filtration, temperature, humidity, or pollutant movement",
    evidence: "System logs, thermostat state, maintenance refs, and airflow notes should be linked."
  },
  {
    name: "Filtration Status Window",
    depth: "Focused depth",
    status: "Active",
    fields: 14,
    description: "Filter presence, type, age, replacement state, and performance context for an air system.",
    focus: "filtration status needs to be connected to air quality or ventilation evidence",
    evidence: "Filter labels, replacement logs, photos, system refs, and inspection notes are expected."
  },
  {
    name: "CO2 Concentration Window",
    depth: "High depth",
    status: "Active",
    fields: 18,
    description: "Carbon dioxide concentration readings used to infer ventilation or occupancy patterns.",
    focus: "CO2 readings need time, sensor, occupancy, and ventilation context",
    evidence: "CO2 sensor feeds, calibration refs, occupancy notes, and room context should be linked."
  },
  {
    name: "Radon Screening Window",
    depth: "High depth",
    status: "Active",
    fields: 18,
    description: "Radon screening period with device, placement, duration, and building context.",
    focus: "radon screening results need governed placement and time-window evidence",
    evidence: "Device results, placement photos, building level, test duration, and lab refs are expected."
  },
  {
    name: "Lead Paint Risk Context",
    depth: "High depth",
    status: "Active",
    fields: 19,
    description: "Context for suspected or confirmed lead paint risk across building surfaces and disturbance state.",
    focus: "lead paint risk needs surface, age, disturbance, and inspection evidence",
    evidence: "Inspection reports, surface photos, building age records, and test results should be linked."
  },
  {
    name: "Asbestos Disturbance Context",
    depth: "High depth",
    status: "Active",
    fields: 20,
    description: "Context for potential asbestos-containing material and disturbance or remediation activity.",
    focus: "asbestos disturbance needs material, containment, safety, and professional evidence",
    evidence: "Material surveys, work logs, containment photos, lab reports, and remediation refs are expected."
  },
  {
    name: "Pest Activity Observation",
    depth: "Focused depth",
    status: "Active",
    fields: 13,
    description: "Observed pest activity, signs, location, timing, and environmental contributing factors.",
    focus: "pest activity may alter environmental hygiene, allergen, or contamination context",
    evidence: "Photos, trap logs, inspection notes, location refs, and service records should be attached."
  },
  {
    name: "Waste Handling Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 15,
    description: "Handling, storage, disposal, and exposure context for waste materials in an environment.",
    focus: "waste handling practices affect contamination, odor, pest, or hygiene interpretation",
    evidence: "Disposal logs, container photos, service refs, and area observations should be linked."
  },
  {
    name: "Food Service Environment Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 17,
    description: "Environmental state around food service areas, preparation surfaces, storage, and serving flow.",
    focus: "food service environment needs spatial and temporal context separate from the food record",
    evidence: "Temperature logs, cleaning notes, area photos, service records, and observation refs are expected."
  },
  {
    name: "Transport Cabin Environment",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Cabin environment context for vehicles, aircraft, trains, rideshare, or transit spaces.",
    focus: "transport cabin conditions affect ventilation, crowding, odor, sound, or exposure interpretation",
    evidence: "Route timing, cabin notes, occupancy context, sensor readings, and vehicle refs should be attached."
  },
  {
    name: "Workplace Exposure Context",
    depth: "High depth",
    status: "Active",
    fields: 21,
    description: "Workplace environmental exposure context across tasks, areas, controls, and measurement windows.",
    focus: "workplace exposure needs task, area, control, and source evidence context",
    evidence: "Task logs, area maps, PPE notes, sensor data, and safety records should be linked."
  },
  {
    name: "Classroom Environment Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 17,
    description: "Classroom environmental conditions including ventilation, occupancy, noise, light, and comfort.",
    focus: "classroom conditions need a bounded window for learning or observation interpretation",
    evidence: "Room schedules, occupancy notes, sensor readings, and facility context should be attached."
  },
  {
    name: "Sleep Environment Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 18,
    description: "Sleep setting context for room state, bedding, temperature, light, noise, and ventilation.",
    focus: "sleep environment conditions may explain observations, measurements, or responses",
    evidence: "Room notes, device readings, light or noise logs, and setting photos should be linked."
  },
  {
    name: "Exercise Environment Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Environmental context around exercise settings, equipment, intensity, air, heat, and surface state.",
    focus: "exercise environment changes exposure, comfort, response, or measurement interpretation",
    evidence: "Activity logs, location notes, temperature readings, equipment refs, and observation evidence are expected."
  },
  {
    name: "Clinical Room Environment",
    depth: "Moderate depth",
    status: "Active",
    fields: 17,
    description: "Clinical room environmental state for care settings, measurement events, or controlled observations.",
    focus: "clinical room conditions need controlled context around a measurement or encounter",
    evidence: "Room logs, equipment state, cleaning records, temperature readings, and observation refs should be linked."
  },
  {
    name: "Outdoor Recreation Context",
    depth: "Focused depth",
    status: "Active",
    fields: 14,
    description: "Outdoor recreation setting context including terrain, weather, surface, crowding, and route state.",
    focus: "outdoor activity conditions affect exposure or observation interpretation",
    evidence: "Route notes, weather refs, terrain photos, and activity timestamps should be attached."
  },
  {
    name: "Wildfire Smoke Impact Window",
    depth: "High depth",
    status: "Active",
    fields: 20,
    description: "Wildfire smoke impact context with particulate readings, plume state, alerts, and location data.",
    focus: "wildfire smoke needs linked air quality, weather, alert, and timing evidence",
    evidence: "AQI feeds, smoke maps, alert records, weather context, and sensor readings are expected."
  },
  {
    name: "Flood Exposure Context",
    depth: "High depth",
    status: "Active",
    fields: 19,
    description: "Flood or water intrusion exposure context for areas, materials, duration, and contamination risk.",
    focus: "flood exposure needs area, water source, material impact, and cleanup evidence",
    evidence: "Photos, water marks, cleanup records, weather reports, and inspection notes should be linked."
  },
  {
    name: "Heat Event Context Window",
    depth: "High depth",
    status: "Active",
    fields: 18,
    description: "Extreme heat event context for spaces, routes, activity windows, and mitigation conditions.",
    focus: "heat events need temperature, humidity, activity, and shelter context",
    evidence: "Weather alerts, temperature feeds, route notes, cooling access, and observation refs are expected."
  },
  {
    name: "Cold Event Context Window",
    depth: "High depth",
    status: "Active",
    fields: 18,
    description: "Extreme cold event context for outdoor or indoor exposure, insulation, heating, and duration.",
    focus: "cold events need temperature, wind, heating, clothing, and timing context",
    evidence: "Weather alerts, temperature readings, shelter notes, and observation refs should be attached."
  },
  {
    name: "Barometric Pressure Window",
    depth: "Focused depth",
    status: "Active",
    fields: 13,
    description: "Barometric pressure state and pressure changes across a measured time window.",
    focus: "pressure changes may modify environmental or physiological observation interpretation",
    evidence: "Pressure feeds, weather station refs, timestamps, and local condition notes should be linked."
  },
  {
    name: "UV Index Exposure Window",
    depth: "Focused depth",
    status: "Active",
    fields: 14,
    description: "Ultraviolet exposure context including UV index, duration, shade, clothing, and location.",
    focus: "UV exposure needs time, location, shade, and protection context",
    evidence: "UV feeds, weather refs, location notes, shade context, and activity logs are expected."
  },
  {
    name: "Vibration Exposure Window",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Vibration exposure context for vehicles, equipment, machinery, floors, or local events.",
    focus: "vibration exposure needs source, intensity, duration, and measurement context",
    evidence: "Device readings, equipment refs, source notes, and timing logs should be linked."
  },
  {
    name: "Electromagnetic Field Context",
    depth: "Moderate depth",
    status: "Active",
    fields: 16,
    description: "Electromagnetic field context for source proximity, measured levels, shielding, and duration.",
    focus: "EMF context needs source, distance, measurement, and timing evidence",
    evidence: "Meter readings, source refs, distance notes, floor plans, and timestamped observations are expected."
  },
  {
    name: "Geospatial Area Context",
    depth: "Focused depth",
    status: "Active",
    fields: 15,
    description: "Geospatial boundary and area context for environmental records, routes, sites, and observations.",
    focus: "an environmental record needs a precise spatial area or route boundary",
    evidence: "Coordinates, polygons, route files, maps, and location notes should be attached."
  },
  {
    name: "Environmental Sensor Calibration",
    depth: "High depth",
    status: "Active",
    fields: 17,
    description: "Calibration state and reliability context for sensors used in environmental evidence.",
    focus: "sensor evidence needs calibration, device, drift, and maintenance context",
    evidence: "Calibration certificates, device ids, maintenance logs, and validation notes are expected."
  }
];

objectTypes.push(...additionalEnvironmentObjectTypes.map(makeEnvironmentObjectType));

const state = {
  selectedId: null,
  query: "",
  filters: {
    domain: "",
    sensitivity: "",
    depth: "",
    status: ""
  },
  activeTab: "overview"
};

const elements = {
  list: document.querySelector("#objectList"),
  details: document.querySelector("#detailsPanel"),
  search: document.querySelector("#objectSearch"),
  resultCount: document.querySelector("#resultCount"),
  clearSelection: document.querySelector("#clearSelection"),
  filters: {
    domain: document.querySelector("#domainFilter"),
    sensitivity: document.querySelector("#sensitivityFilter"),
    depth: document.querySelector("#depthFilter"),
    status: document.querySelector("#statusFilter")
  }
};

const filterLabels = {
  domain: "All domains",
  sensitivity: "All sensitivity tiers",
  depth: "All depths",
  status: "All statuses"
};

function labelClass(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getLabels(item) {
  return [item.domain, item.sensitivity, item.depth, item.status];
}

function getFilterOptions(key) {
  return [...new Set(objectTypes.map((item) => item[key]))].sort((a, b) => a.localeCompare(b));
}

function populateFilters() {
  Object.entries(elements.filters).forEach(([key, select]) => {
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = filterLabels[key];
    select.append(allOption);

    getFilterOptions(key).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  });
}

function matchesFilters(item) {
  return Object.entries(state.filters).every(([key, value]) => !value || item[key] === value);
}

function matchesQuery(item) {
  const query = state.query.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [
    item.name,
    item.schemaName,
    item.description,
    item.domain,
    item.sensitivity,
    item.depth,
    item.status
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function renderTags(item) {
  return getLabels(item)
    .map((label) => `<span class="tag ${labelClass(label)}">${label}</span>`)
    .join("");
}

function renderList() {
  const visibleItems = objectTypes.filter((item) => matchesQuery(item) && matchesFilters(item));
  elements.resultCount.textContent = `Showing ${visibleItems.length} of ${objectTypes.length} object types`;
  elements.list.innerHTML = "";

  if (!visibleItems.length) {
    const empty = document.createElement("p");
    empty.className = "no-results";
    empty.textContent = "No object types match this search.";
    elements.list.append(empty);
    return;
  }

  visibleItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `object-card${state.selectedId === item.id ? " is-selected" : ""}`;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(state.selectedId === item.id));
    button.dataset.id = item.id;
    button.innerHTML = `
      <strong>${item.name}</strong>
      <span class="tag-row">${renderTags(item)}</span>
    `;
    button.addEventListener("click", () => selectItem(item.id));
    elements.list.append(button);
  });
}

function renderEmptyDetails() {
  elements.details.innerHTML = `
    <div class="empty-state">
      <p>Please select environment type.</p>
      <p>The selected object type will show its area, record type, field count, records, validation posture, and source evidence details here.</p>
    </div>
  `;
}

function renderMeta(label, value) {
  return `
    <div>
      <p class="meta-term">${label}</p>
      <p class="meta-desc">${value}</p>
    </div>
  `;
}

function renderMetric(label, value) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderGlance(label, value) {
  return `
    <div class="glance-item">
      <h3>${label}</h3>
      <p>${value}</p>
    </div>
  `;
}

function renderFields(fields) {
  return fields
    .map(
      ([name, key, type]) => `
        <div class="field-row">
          <div class="field-name">
            <strong>${name}</strong>
            <span class="field-key">${key}</span>
          </div>
          <span class="field-type">${type}</span>
        </div>
      `
    )
    .join("");
}

function tabClass(id) {
  return `tab-button${state.activeTab === id ? " is-active" : ""}`;
}

function tabSelected(id) {
  return String(state.activeTab === id);
}

function renderDetails() {
  const item = objectTypes.find((type) => type.id === state.selectedId);

  if (!item) {
    renderEmptyDetails();
    return;
  }

  elements.details.innerHTML = `
    <article class="detail-inner">
      <header class="detail-header">
        <div>
          <h2>${item.name}</h2>
        </div>
        <button class="cta-button primary" type="button" data-command="propose">
          <svg class="button-icon lucide lucide-plus" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span>Propose record</span>
        </button>
      </header>

      <div class="detail-actions">
        <nav class="detail-tabs" aria-label="Selected object views" role="tablist">
          <button class="${tabClass("overview")}" type="button" role="tab" aria-selected="${tabSelected("overview")}" data-tab="overview">Overview</button>
          <button class="${tabClass("dossier")}" type="button" role="tab" aria-selected="${tabSelected("dossier")}" data-tab="dossier">Object dossier</button>
          <button class="${tabClass("validation")}" type="button" role="tab" aria-selected="${tabSelected("validation")}" data-tab="validation">Validation</button>
          <button class="${tabClass("source")}" type="button" role="tab" aria-selected="${tabSelected("source")}" data-tab="source">Source evidence</button>
        </nav>
      </div>

      <p class="detail-description">${item.description}</p>

      <div class="location-strip" aria-label="Ontology location">
        ${renderMeta("Current section", item.section)}
        ${renderMeta("Area", item.area)}
        ${renderMeta("Record type", item.name)}
      </div>

      <div class="metrics-grid" aria-label="Record metrics">
        ${renderMetric("Fields", item.fields)}
        ${renderMetric("Records", item.records)}
        ${renderMetric("Source", item.source)}
        ${renderMetric("Snapshot", item.snapshot)}
      </div>

      <div class="glance-grid" aria-label="At a glance">
        ${renderGlance("Record type", item.description)}
        ${renderGlance("Use when", item.useWhen)}
        ${renderGlance("Needs before use", item.needs)}
        ${renderGlance("Next action", item.nextAction)}
      </div>

      <section class="detail-section" aria-labelledby="fields-heading">
        <div class="section-head">
          <h3 id="fields-heading">All fields</h3>
          <p>${item.fields} fields / ${item.records} records</p>
        </div>
        <div class="detail-grid">
          <div class="field-list">
            ${renderFields(item.fieldsList)}
          </div>
          <aside class="governance-panel" aria-label="Governance and source evidence">
            <h3>Governed authoring boundary</h3>
            <div class="stage-list">
              <div class="stage">
                <span>Draft</span>
                <p>Authorized users can stage a schema-aware proposal for review.</p>
              </div>
              <div class="stage">
                <span>Review</span>
                <p>Validation checks required fields, provenance, lifecycle state, and source evidence.</p>
              </div>
              <div class="stage">
                <span>Published</span>
                <p>Publication remains blocked until review and evidence requirements pass.</p>
              </div>
            </div>
            <div class="source-box">
              <p class="meta-term">Source of evidence</p>
              <p>${item.evidence}</p>
            </div>
          </aside>
        </div>
      </section>
    </article>
  `;

  elements.details.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      renderDetails();
    });
  });
}

function selectItem(id) {
  state.selectedId = id;
  state.activeTab = "overview";
  renderList();
  renderDetails();
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderList();
});

Object.entries(elements.filters).forEach(([key, select]) => {
  select.addEventListener("change", (event) => {
    state.filters[key] = event.target.value;
    renderList();
  });
});

elements.clearSelection.addEventListener("click", () => {
  state.selectedId = null;
  state.query = "";
  elements.search.value = "";
  Object.entries(elements.filters).forEach(([key, select]) => {
    state.filters[key] = "";
    select.value = "";
  });
  state.activeTab = "overview";
  renderList();
  renderDetails();
});

populateFilters();
renderList();
renderDetails();

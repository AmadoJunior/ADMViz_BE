import colormap from "colormap";

async function fetchDataset(
  dataSrc: {
    endpoint: string;
    dataKey: string;
  },
  labelKey: string,
  filter: string,
  auth: string,
  method: string
) {
  const labels = [];
  const data = [];
  let status;
  try {
    const res = await fetch(
      `${dataSrc?.endpoint}?${new URLSearchParams(filter)}`,
      {
        method: method,
        headers: {
          authorization: `${auth}`,
        },
      }
    );
    status = res.status;
    if (status !== 200) {
      throw new Error(String(status));
    }

    const json = await res.json();
    for (let point of json) {
      labels.push(point?._id?.[labelKey]);
      data.push(point[dataSrc.dataKey]);
    }
  } catch (err: any) {
    console.log("FROM WORKER: ", err?.message);
    return {
      status: err.message,
      labels,
      data,
      label: dataSrc.dataKey,
    };
  }

  return {
    status,
    labels,
    data,
    label: dataSrc.dataKey,
  };
}

onmessage = async ({
  data: { datasets, labelKey, method, filter, type, styles, auth },
}) => {
  const datasetsArr = [];
  const labelsSet = new Set<string>();
  let resStatus;
  let labelsArr: string[] = [];

  for (const dataSrc of datasets) {
    const { status, labels, data, label } = await fetchDataset(
      dataSrc,
      labelKey,
      filter,
      auth,
      method
    );
    //Status
    resStatus = status;
    //Labels
    for (const label of labels) {
      labelsSet.add(label);
    }
    labelsArr = Array.from(labelsSet);

    //Styles
    styles.backgroundColor = [];
    styles.borderColor = [];
    if (type !== "line" && type !== "bar" && type !== "radar") {
      let colors = colormap({
        colormap: "salinity",
        nshades: Math.max(9, labelsArr?.length),
        format: "hex",
        alpha: 1,
      });
      for (let i = 0; i < labelsArr.length; i++) {
        styles.backgroundColor.push(colors[i]);
        styles.borderColor.push(colors[i]);
      }
      console.log(styles);
    } else {
      let colors = colormap({
        colormap: "salinity",
        nshades: Math.max(9, datasets?.length),
        format: "hex",
        alpha: 1,
      });
      for (let i = 0; i < datasets.length; i++) {
        styles.backgroundColor.push(colors[i]);
        styles.borderColor.push(colors[i]);
      }
    }

    //Dataset
    datasetsArr.push({
      label,
      data,
      ...styles,
    });
  }

  //Send to Master
  postMessage({
    status: resStatus,
    chartData: {
      labels: labelsArr,
      datasets: datasetsArr,
    },
  });
};

export {};

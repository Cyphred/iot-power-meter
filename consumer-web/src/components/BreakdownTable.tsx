import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IRateBreakdown } from "../types/ConsumptionReport";
import { useAppSelector } from "../redux/hooks";

interface DataType extends IRateBreakdown {
  key: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (value: number) => <>Php. {value.toFixed(2)}</>,
  },
];

const BreakdownTable = () => {
  const { rateBreakdown, ratePerKwh, kwhSinceCutoff } = useAppSelector(
    (state) => {
      return {
        rateBreakdown: state.stats.consumption?.rateBreakdown,
        ratePerKwh: state.stats.consumption?.ratePerKwh,
        kwhSinceCutoff: state.stats.consumption?.consumption.sinceCutoff,
      };
    }
  );

  const parsedData: DataType[] = [];

  if (rateBreakdown && rateBreakdown.length) {
    for (const d of rateBreakdown) {
      parsedData.push({
        ...d,
        key: d.description.toLowerCase(),
      });
    }

    parsedData.push({
      description: "Price per KWH",
      key: "price_per_kwh",
      amount: ratePerKwh !== undefined ? ratePerKwh : 0,
    });

    parsedData.push({
      description: "Total consumption (KWH)",
      key: "total_consumption",
      amount: kwhSinceCutoff !== undefined ? kwhSinceCutoff : 0,
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={parsedData}
      pagination={false}
      bordered
      style={{ margin: 16 }}
      size="small"
    />
  );
};

export default BreakdownTable;

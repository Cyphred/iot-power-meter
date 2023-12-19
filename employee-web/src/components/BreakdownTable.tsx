import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IRateBreakdown } from "../types/ConsumptionReport";

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
    render: (value: number) => <>Php. {value.toFixed(4)}</>,
  },
];

const BreakdownTable = (props: {
  rateBreakdown: IRateBreakdown[];
  ratePerKwh: number;
  kwhSinceCutoff: number;
}) => {
  const { rateBreakdown, ratePerKwh, kwhSinceCutoff } = props;

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

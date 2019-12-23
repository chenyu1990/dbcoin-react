import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import { ChartCard, MiniArea } from './Charts';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = ({
  loading,
  visitData,
  member,
  income,
  expend,
  contract,
  expendFromAdmin,
}) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="总注册人数"
        loading={loading}
        total={member.total}
        contentHeight={46}
      >
        <Row>
          <Col>充值人数： {member.recharged}</Col>
          <Col>消费人数： {member.consumed}</Col>
        </Row>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="总收入 USDT"
        total={`${income.usdt}`}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="总支出/实际支出"
        total={' '}
        contentHeight={46}
      >
        <Row>
          <Col span={16}>
            <Tooltip title={expend.btc_count.toFixed(8)}>
              BTC： {expend.btc_count.toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title={(expend.btc_count - expendFromAdmin.btc).toFixed(8)}>
              {(expend.btc_count - expendFromAdmin.btc).toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={16}>
            <Tooltip title={expend.usdt_count.toFixed(8)}>
              USDT： {expend.usdt_count.toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title={(expend.usdt_count - expendFromAdmin.usdt).toFixed(8)}>
              {(expend.usdt_count - expendFromAdmin.usdt).toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={16}>
            <Tooltip title={expend.ttc_count.toFixed(8)}>
              TTC： {expend.ttc_count.toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title={(expend.ttc_count - expendFromAdmin.ttc).toFixed(8)}>
              {(expend.ttc_count - expendFromAdmin.ttc).toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={16}>
            <Tooltip title={expend.point_count.toFixed(8)}>
              积分： {expend.point_count.toFixed(2)}
            </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title={(expend.point_count - expendFromAdmin.point).toFixed(8)}>
              {(expend.point_count - expendFromAdmin.point).toFixed(2)}
            </Tooltip>
          </Col>
        </Row>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="合约销售总量"
        total={contract.sold}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;

import { Card, Divider, Radio, Tooltip } from 'antd';
import React from 'react';
import { Pie } from './Charts';
import styles from '../style.less';

const Proportion = ({
  loading,
  pieData,
  title,
  type,
  subTitle,
  renderDetail,
  handleChangeType,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={title}
    style={{
      height: '100%',
    }}
    extra={
      type ? (
        <div className={styles.salesCardExtra}>
          <div className={styles.salesTypeRadio}>
            <Radio.Group value={type} onChange={handleChangeType}>
              <Radio.Button value="usdt">USDT</Radio.Button>
              <Radio.Button value="btc">BTC</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      ) : null
    }
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        {title}
      </h4>
      <Pie
        hasLegend
        renderDetail={renderDetail}
        subTitle={subTitle ? subTitle : title}
        total={pieData.reduce((pre, now) => now.y + pre, 0)}
        data={pieData}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default Proportion;

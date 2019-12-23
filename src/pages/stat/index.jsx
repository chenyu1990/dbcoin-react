import { Col, Dropdown, Icon, Menu, Row, Tooltip } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const Proportion = React.lazy(() => import('./components/Proportion'));

@connect(({ stat, loading }) => ({
  stat,
  loading: loading.effects['stat/fetch'],
}))
class Stat extends Component {
  state = {
    expendPies: {
      btc: [],
      usdt: [],
    },
    expendType: 'usdt',
    rangePickerValue: getTimeDistance('year'),
    expendFromAdmin: {
      btc: 0,
      usdt: 0,
    },
  };
  reqRef = 0;
  timeoutId = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'stat/fetch',
        callback: ({ response, data }) => {
          if (response.status === 200) {
            const {
              expend: {
                recommend_usdt,
                admin_usdt,
                admin_btc,
              },
            } = data;
            let expendPies = {
              btc: [],
              usdt: [],
            };
            expendPies.btc.push({
              x: '管理添加',
              y: admin_btc,
            });
            expendPies.usdt.push({
              x: '推荐奖励',
              y: recommend_usdt,
            });
            expendPies.usdt.push({
              x: '管理添加',
              y: admin_usdt,
            });
            let expendFromAdmin = {};
            expendFromAdmin.btc = admin_btc;
            expendFromAdmin.usdt = admin_usdt;
            this.setState({
              expendPies,
              expendFromAdmin,
            });
          }
        },
      });
    });
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'test/clear',
    // });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeExpendType = e => {
    this.setState({
      expendType: e.target.value,
    });
  };

  render() {
    const { expendPies, expendType, expendFromAdmin } = this.state;
    const { loading, stat } = this.props;

    const expendPie = expendPies[expendType];
    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} {...stat} expendFromAdmin={expendFromAdmin} />
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginBottom: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Proportion
                  title="支出占比"
                  subTitle="支出分布"
                  renderDetail={item => (
                    <React.Fragment>
                      <Tooltip
                        placement="left"
                        title={`${item.x}：${(Number.isNaN(item.percent) ? 0 : item.percent * 100
                        ).toFixed(2)}%`}
                      >
                        <span style={{ position: 'absolute', right: 0 }}>
                          {expendType === 'usdt' || expendType === 'btc' ? item.y.toFixed(8) : item.y}
                        </span>
                      </Tooltip>
                    </React.Fragment>
                  )}
                  type={expendType}
                  loading={loading}
                  pieData={expendPie}
                  handleChangeType={this.handleChangeExpendType}
                />
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            {/*<SalesCard*/}
            {/*  rangePickerValue={rangePickerValue}*/}
            {/*  salesData={salesData}*/}
            {/*  isActive={this.isActive}*/}
            {/*  handleRangePickerChange={this.handleRangePickerChange}*/}
            {/*  loading={loading}*/}
            {/*  selectDate={this.selectDate}*/}
            {/*/>*/}
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Stat;

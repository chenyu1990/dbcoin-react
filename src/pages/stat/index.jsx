import { Col, Dropdown, Icon, Menu, Row, Tooltip } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const Proportion = React.lazy(() => import('./components/Proportion'));

@connect(({ stat, loading }) => ({
  stat,
  loading: loading.effects['stat/fetch'],
}))
class Stat extends Component {
  state = {
    levelPie: [],
    expendPies: {
      btc: [],
      usdt: [],
      ttc: [],
      point: [],
    },
    expendType: 'usdt',
    rangePickerValue: getTimeDistance('year'),
    expendFromAdmin: {
      btc: 0,
      usdt: 0,
      ttc: 0,
      point: 0,
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
              member: { total: memberTotal },
              level,
            } = data;
            const {
              level: { five_level, four_level, one_level, six_level, three_level, two_level },
            } = data;
            const {
              expend: {
                machine_btc,
                diff_level_btc,
                hold_contract_usdt,
                buy_contract_ttc,
                buy_contract_point,
                recommend_usdt,
                recommend_ttc,
                diff_level_usdt,
                diff_level_ttc,
                admin_usdt,
                admin_btc,
                admin_ttc,
                admin_point,
              },
            } = data;
            let levelPie = [];
            let expendPies = {
              btc: [],
              usdt: [],
              ttc: [],
              point: [],
            };
            let zeroLevel = memberTotal;
            for (let i in level) {
              zeroLevel -= level[i];
            }
            levelPie.push({
              x: '零级',
              y: zeroLevel,
            });
            levelPie.push({
              x: '一级',
              y: one_level,
            });
            levelPie.push({
              x: '二级',
              y: two_level,
            });
            levelPie.push({
              x: '三级',
              y: three_level,
            });
            levelPie.push({
              x: '四级',
              y: four_level,
            });
            levelPie.push({
              x: '五级',
              y: five_level,
            });
            levelPie.push({
              x: '六级',
              y: six_level,
            });
            expendPies.btc.push({
              x: '矿机',
              y: machine_btc,
            });
            expendPies.btc.push({
              x: '管理添加',
              y: admin_btc,
            });
            expendPies.btc.push({
              x: '推荐级差',
              y: diff_level_btc,
            });
            expendPies.usdt.push({
              x: '持币分红',
              y: hold_contract_usdt,
            });
            expendPies.usdt.push({
              x: '推荐奖励',
              y: recommend_usdt,
            });
            expendPies.usdt.push({
              x: '推荐级差',
              y: diff_level_usdt,
            });
            expendPies.usdt.push({
              x: '管理添加',
              y: admin_usdt,
            });
            expendPies.ttc.push({
              x: '合约购买',
              y: buy_contract_ttc,
            });
            expendPies.ttc.push({
              x: '推荐奖励',
              y: recommend_ttc,
            });
            expendPies.ttc.push({
              x: '推荐级差',
              y: diff_level_ttc,
            });
            expendPies.ttc.push({
              x: '管理添加',
              y: admin_ttc,
            });
            expendPies.point.push({
              x: '合约购买',
              y: buy_contract_point,
            });
            expendPies.point.push({
              x: '管理添加',
              y: admin_point,
            });
            let expendFromAdmin = {};
            expendFromAdmin.btc = admin_btc;
            expendFromAdmin.usdt = admin_usdt;
            expendFromAdmin.ttc = admin_ttc;
            expendFromAdmin.point = admin_point;
            this.setState({
              levelPie,
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
  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };
  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });
    dispatch({
      type: 'test/fetchSalesData',
    });
  };
  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
    dispatch({
      type: 'test/fetchSalesData',
    });
  };
  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  render() {
    const { levelPie, expendPies, expendType, expendFromAdmin } = this.state;
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
                <Proportion title="等级分布" loading={loading} pieData={levelPie} />
              </Suspense>
            </Col>
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

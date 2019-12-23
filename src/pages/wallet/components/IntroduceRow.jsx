import React, { PureComponent } from 'react';
import { Col, Row, Input, InputNumber, Button, Modal } from 'antd';
import { ChartCard } from './Charts';

const { warn, confirm } = Modal;

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

const transferProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: {
    marginBottom: 24,
  },
};

class IntroduceRow extends PureComponent {
  state = {
    btcAddress: '',
    btcAmount: '',
    usdtAddress: '',
    usdtAmount: '',
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { btcAddress, btcAmount, usdtAddress, usdtAmount } = this.state;
    return btcAddress !== nextState.btcAddress ||
    btcAmount !== nextState.btcAmount ||
    usdtAddress !== nextState.usdtAddress ||
    usdtAmount !== nextState.usdtAmount;
  }

  onChangeBtcAddress = e => {
    this.setState({ btcAddress: e.target.value });
  };

  onChangeBtcAmount = btcAmount => {
    this.setState({ btcAmount });
  };

  onChangeUsdtAddress = e => {
    this.setState({ usdtAddress: e.target.value });
  };

  onChangeUsdtAmount = usdtAmount => {
    this.setState({ usdtAmount });
  };

  handleWithdrawBtc = () => {
    const { btcAddress, btcAmount } = this.state;
    const { onWithdrawBtc } = this.props;
    if (btcAddress === '') {
      warn({
        title: '地址不能为空'
      });
    } else if (btcAmount < 0.00000001) {
      warn({
        title: '金额过小'
      });
    } else if (onWithdrawBtc) {
      const modal = confirm({
        width: 500,
        title: `确认转出？`,
        content: (
          <React.Fragment>
            <p>地址：{btcAddress}</p>
            <p>金额：{btcAmount.toFixed(8)}</p>
            <p style={{ color: 'red', fontWeight: 1000 }}>确认转出地址，转出不可撤销</p>
            <Input placeholder='请输入转出金额以继续'
                   onChange={({ target: { value: amount } }) => {
                     this.setState({ amount });
                     modal.update({
                       okButtonProps: {
                         disabled: Number(amount) !== btcAmount
                       },
                     })
                   }}/>
          </React.Fragment>
        ),
        okText: '确认',
        okType: 'danger',
        okButtonProps: {
          disabled: true,
        },
        cancelText: '取消',
        onOk: () => {
          onWithdrawBtc({ address: btcAddress, amount: btcAmount })
        },
      });
    }
  };

  handleWithdrawUsdt = () => {
    const { usdtAddress, usdtAmount } = this.state;
    const { onWithdrawUsdt } = this.props;
    if (usdtAddress === '') {
      warn({
        title: '地址不能为空'
      });
    } else if (usdtAmount < 0.00000001) {
      warn({
        title: '金额过小'
      });
    } else if (onWithdrawUsdt) {
      const modal = confirm({
        width: 500,
        title: `确认转出？`,
        content: (
          <React.Fragment>
            <p>地址：{usdtAddress}</p>
            <p>金额：{usdtAmount.toFixed(8)}</p>
            <p style={{ color: 'red', fontWeight: 1000 }}>确认转出地址，转出不可撤销</p>
            <Input placeholder='请输入转出金额以继续'
                   onChange={({ target: { value: amount } }) => {
                     this.setState({ amount });
                     modal.update({
                       okButtonProps: {
                         disabled: Number(amount) !== usdtAmount
                       },
                     })
                   }}/>
          </React.Fragment>
        ),
        okText: '确认',
        okType: 'danger',
        okButtonProps: {
          disabled: true,
        },
        cancelText: '取消',
        onOk: () => {
          onWithdrawUsdt({ address: usdtAddress, amount: usdtAmount })
        },
      });
    }
  };

  render() {
    const { loading, wallet: { stat } } = this.props;
    const { btcAddress, btcAmount, usdtAddress, usdtAmount } = this.state;
    return (
      <Row gutter={24} type="flex">
        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="钱包余额"
            loading={loading}
            contentHeight={46}
          >
            <Row>
              <Col>BTC： {stat.btc_balance.toFixed(8)}</Col>
              <Col>USDT： {stat.usdt_balance.toFixed(8)}</Col>
            </Row>
          </ChartCard>
        </Col>

        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="BTC交易"
            loading={loading}
            contentHeight={46}
          >
            <Row>
              <Col>转出： {stat.btc_send_total}</Col>
              <Col>转入： {stat.btc_receive_total}</Col>
            </Row>
          </ChartCard>
        </Col>

        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="USDT交易"
            loading={loading}
            contentHeight={46}
          >
            <Row>
              <Col>转出： {stat.usdt_send_total}</Col>
              <Col>转入： {stat.usdt_receive_total}</Col>
            </Row>
          </ChartCard>
        </Col>

        <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title="中央钱包地址"
            loading={loading}
            contentHeight={46}
          >
            <Row>
              <Col>可支配USDT: {stat.center_wallet_usdt}</Col>
              <Col>{stat.center_wallet_address}</Col>
            </Row>
          </ChartCard>
        </Col>

        <Col {...transferProps}>
          <ChartCard
            bordered={false}
            title="BTC转出"
            loading={loading}
            contentHeight={46}
          >
            <Row gutter={24}>
              <Col span={14}><Input placeholder='转出地址' onChange={this.onChangeBtcAddress} value={btcAddress} /></Col>
              <Col span={6}><InputNumber step={0.05} style={{ width: '100%' }} placeholder='转出金额' min={0}
                                         onChange={this.onChangeBtcAmount} value={btcAmount} /></Col>
              <Col span={2}><Button onClick={this.handleWithdrawBtc}>转出</Button></Col>
            </Row>
          </ChartCard>
        </Col>

        <Col {...transferProps}>
          <ChartCard
            bordered={false}
            title="USDT转出"
            loading={loading}
            contentHeight={46}
          >
            <Row gutter={24}>
              <Col span={14}><Input placeholder='转出地址' onChange={this.onChangeUsdtAddress} value={usdtAddress} /></Col>
              <Col span={6}><InputNumber step={0.05} style={{ width: '100%' }} placeholder='转出金额' min={0}
                                         onChange={this.onChangeUsdtAmount} value={usdtAmount} /></Col>
              <Col span={2}><Button onClick={this.handleWithdrawUsdt}>转出</Button></Col>
            </Row>
          </ChartCard>
        </Col>
      </Row>
    )
  }
}

export default IntroduceRow;

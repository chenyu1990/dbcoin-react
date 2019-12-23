import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));

@connect(({ wallet, loading }) => ({
  wallet,
  loading: loading.effects['wallet/fetch'],
}))
class wallet extends Component {
  reqRef = 0;

  componentDidMount() {
    this.reqRef = requestAnimationFrame(() => {
      this.init();
    });
  }

  init = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wallet/stat',
    });
  };

  onWithdrawBtc = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wallet/withdrawBtc',
      payload: values,
      success: () => this.init,
    });
  };

  onWithdrawUsdt = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wallet/withdrawUsdt',
      payload: values,
      success: () => this.init,
    });
  };

  render() {
    const { loading, wallet } = this.props;
    const { stat } = wallet;

    const withdraw = {
      onWithdrawBtc: this.onWithdrawBtc,
      onWithdrawUsdt: this.onWithdrawUsdt,
    };

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            { stat ? <IntroduceRow loading={loading} wallet={wallet} {...withdraw} /> : null }
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default wallet;

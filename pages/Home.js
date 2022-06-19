import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseRouter} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, LogBox} from 'react-native';
import {ScrollView, View} from 'react-native';
import {
  Caption,
  Headline,
  Text,
  Title,
  ActivityIndicator,
  Button,
  Appbar,
  Searchbar,
} from 'react-native-paper';
import API_URL from './Constants';

import axios from 'axios';
axios.defaults.baseURL = API_URL;

const StatusPage = () => {
  const [status, setStatus] = useState('free');
  const [id, setId] = useState();
  const [order, setOrder] = useState();

  const fetchStatus = async () => {
    const res = await axios.get('/currentorder');
    const response = res.data;
    setOrder(response);

    // if none = free
    // if type is order -- check if status is accepted, confirm or reject the delivering person
    // if type is delivery -- wait till confirm or rejected
    // if confirmed show button to complete and payment
    if (response.type == 'none') {
      setStatus('free');
    } else {
      setId(response.order._id);
      if (response.type == 'order') {
        if (response.order.status == 'accepted') {
          setStatus('accepted');
        } else if (response.order.status == 'confirmed') {
          setStatus('wait-for-del');
        } else if (response.order.status == 'delivered') {
          setStatus('delivered');
        } else if (response.order.status == 'paid') {
          setStatus('del-conf');
        } else {
          setStatus('awaiting');
        }
      }
      if (response.type == 'delivery') {
        if (response.order.status == 'confirmed') {
          setStatus('payment');
        } else if (response.order.status == 'delivered') {
          setStatus('getting-paid');
        } else if (response.order.status == 'paid') {
          setStatus('confirm-payment');
        } else {
          setStatus('confirming');
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View>
      {status == 'accepted' ? <Accepted id={id} order={order} /> : <></>}
      {status == 'awaiting' ? <Awaiting id={id} order={order} /> : <></>}
      {status == 'payment' ? <Payment id={id} order={order} /> : <></>}
      {status == 'confirming' ? <Confirming id={id} order={order} /> : <></>}
      {status == 'getting-paid' ? <PayGet id={id} order={order} /> : <></>}
      {status == 'confirm-payment' ? (
        <ConfirmPay id={id} order={order} />
      ) : (
        <></>
      )}
      {status == 'free' ? <Free /> : <></>}
      {status == 'wait-for-del' ? (
        <Text>Please wait for delivery.</Text>
      ) : (
        <></>
      )}
      {status == 'delivered' ? (
        <View>
          <Text>
            Order has been delivered, please pay{' '}
            {order?.order?.total || 'money'}.{' '}
          </Text>
          <Button
            onPress={() => {
              axios.post('/order/' + id + '/payment/sent');
            }}>
            Confirm Payment
          </Button>
        </View>
      ) : (
        <></>
      )}
      {status == 'del-conf' ? (
        <Text>Waiting for delivery agent to confirm payment.</Text>
      ) : (
        <></>
      )}
    </View>
  );
};

const Free = () => {
  return <Text>You're not engaged in any delivery currently.</Text>;
};
const reject = id => {
  console.log('reject!');
  axios.post('/order/' + id + '/reject');
};

const confirm = id => {
  console.log('confirm!');
  axios.post('/order/' + id + '/confirm');
};

const ConfirmPay = ({id}) => {
  const payRec = async () => {
    const url = '/order/' + id + '/payment/received';
    await axios.post(url);
  };
  return (
    <>
      <Text>Payment has been completed, please confirm.</Text>
      <Button onPress={() => payRec()}>Confirm payment</Button>
    </>
  );
};

const PayGet = () => {
  return (
    <Text>
      Awaiting payment from customer, thank you for delivering this order.
    </Text>
  );
};

const Awaiting = () => {
  return (
    <Text>Please be patient, awaiting confirmation from a delivery agent.</Text>
  );
};

const Confirming = () => {
  return <Text>Order is being confirmed with the user, please wait.</Text>;
};

const Payment = ({id, order}) => {
  const deliver = async () => {
    const url = '/order/' + id + '/deliver';
    await axios.post(url);
  };
  return (
    <>
      <Text>
        Order in process. Click on the deliver button to confirm delivery and
        recieve payment of {order?.order?.total || 'money'}.
      </Text>
      <Button onPress={() => deliver()}>Deliver order</Button>
    </>
  );
};
const Accepted = ({id, order}) => {
  return (
    <>
      <Text>
        Order has been accepted by{' '}
        {order?.order?.deliveredBy?.name || ' the delivery agent'}, please
        confirm or reject.
      </Text>
      <Button onPress={() => reject(id)}>Reject</Button>
      <Button onPress={() => confirm(id)}>Confirm</Button>
    </>
  );
};

const UserPage = ({user, navigation}) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Home" subtitle="IIIT Hyderabad" />
        <Appbar.Action icon="magnify" onPress={() => console.log('search')} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => console.log('Other')}
        />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Title>Hey there, {user.name}</Title>
        <Button
          mode="contained"
          compact={false}
          icon="cart-plus"
          style={{width: 200, marginTop: 10}}
          onPress={() => navigation.navigate('Place')}>
          Place an order
        </Button>
        <Headline>Active Orders</Headline>
        <StatusPage />
      </ScrollView>
    </View>
  );
};

const HomePage = ({routes, navigation}) => {
  // use user state
  const [user, setUser] = useState({});
  const [userloading, setUserLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        setUser(JSON.parse(userStr));
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + JSON.parse(userStr).token;
        setUserLoading(false);
      } catch (e) {
        console.log('User getting error', e);
      }
    };
    if (userloading) {
      getUserFromStorage();
    }
  }, [user]);
  return (
    <ScrollView>
      {userloading ? (
        <ActivityIndicator />
      ) : (
        <UserPage user={user} navigation={navigation} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 20,
  },
});

export default HomePage;

import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  Caption,
  Headline,
  Text,
  Title,
  ActivityIndicator,
  Button,
  Appbar,
} from 'react-native-paper';
import API_URL from './Constants';

const Item = ({order, navigation}) => (
  <View>
    <Text>{order.orderedBy.name}</Text>
    <Text>{order.quantities.reduce((a, b) => a + b, 0)}</Text>
    <Text>{order.store.name}</Text>
    <Text>{new Date(order.orderdAt).toLocaleTimeString()}</Text>
    <Text>{order.destination}</Text>
    <Button
      onPress={() => {
        console.log(navigation);
        const postOrder = async () => {
          const orderURL = '/order/' + order._id + '/accept';
          await axios.post(orderURL);
        };
        postOrder().then(() => navigation.navigate('OrderFinal'));
      }}>
      Accept Order
    </Button>
  </View>
);

const OrderList = props => {
  const orders = props.orders;
  const navigation = props.navigation;
  const renderItem = ({item}) => <Item order={item} navigation={navigation} />;
  console.log('test', orders);
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Orders" subtitle="IIIT Hyderabad" />
        <Appbar.Action icon="magnify" onPress={() => console.log('search')} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => console.log('Other')}
        />
      </Appbar.Header>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </>
  );
};

const Stack = createNativeStackNavigator();
const OrderPage = () => {
  // use user state
  const [user, setUser] = useState({});
  const [userloading, setUserLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const getUserFromStorage = async () => {
      const userStr = await AsyncStorage.getItem('user');

      const ordersURL = API_URL + 'orders';
      if (ordersLoading) {
        fetch(ordersURL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(userStr).token,
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log(res);
            setOrders(res);
            setOrdersLoading(false);
          })
          .catch(e => console.log(e));
      }
      setUser(JSON.parse(userStr));
      setUserLoading(false);
    };
    if (userloading) {
      getUserFromStorage();
    }
  }, [user, orders]);
  return (
    <>
      {userloading || ordersLoading ? (
        <ActivityIndicator />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Orders"
            component={Orders}
            initialParams={{
              orders: orders,
              user: user,
            }}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderFinal"
            component={OrderFinal}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Confirmed"
            component={Confirmed}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

const Confirmed = ({route, navigation}) => {
  return <View></View>;
};

const Orders = ({route, navigation}) => {
  const {orders, user} = route.params;
  return (
    <>
      <OrderList orders={orders} user={user} navigation={navigation} />
    </>
  );
};

const OrderFinal = ({route, navigation}) => {
  const checkConfirm = async navigation => async () => {
    const res = await axios.get('/currentorder');
    const response = res.data;

    if (response.type == 'none') {
      navigation.navigate('Order');
    }

    if (response.type == 'delivery' && response.order.status == 'confirmed') {
      navigate.navigate('Confirmed');
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      checkConfirm(navigation);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Headline>Please wait for the user to confirm your order!</Headline>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 20,
  },
});

export default OrderPage;

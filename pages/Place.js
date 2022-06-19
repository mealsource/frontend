import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, FlatList, ScrollView} from 'react-native';
import {
  List,
  Title,
  Appbar,
  Text,
  Button,
  Subheading,
  Caption,
  Headline,
  TextInput,
} from 'react-native-paper';

const Item = ({store, setInventory}) => (
  <View style={{}}>
    <Button
      onPress={() => {
        setInventory(store.inventory);
        console.log(store.inventory);
      }}>
      {store.name}
    </Button>
  </View>
);

const Inv = ({invItem, setCart, cart}) => (
  <View>
    <Text>{invItem.name}</Text>
    <Caption>{invItem.price}</Caption>
    <Text>{invItem.description}</Text>
    <Button
      onPress={() => {
        setCart([...cart, invItem]);
        console.log(cart);
      }}>
      Add to Cart
    </Button>
  </View>
);

const PlacePage = () => {
  const [stores, setStores] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      const response = await axios.get('/stores');
      console.log(response.data);
      setStores(response.data);
    };
    fetchStores();
    console.log('Inventory', inventory);
  }, [inventory, cart, ordered]);

  const renderItem = ({item}) => (
    <Item store={item} setInventory={setInventory} />
  );

  const renderInv = ({item}) => (
    <Inv invItem={item} setCart={setCart} cart={cart} />
  );
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Order" subtitle="IIIT Hyderabad" />
        <Appbar.Action icon="magnify" onPress={() => console.log('search')} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => console.log('Other')}
        />
      </Appbar.Header>
      {!ordered ? (
        <ScrollView style={{marginTop: 20, marginLeft: 20}}>
          <Title>Choose Store:</Title>

          <View>
            <FlatList
              nestedScrollEnabled={true}
              data={stores}
              renderItem={renderItem}
              keyExtractor={item => item._id}
            />
          </View>
          <View>
            <FlatList
              nestedScrollEnabled={true}
              data={inventory}
              renderItem={renderInv}
              keyExtractor={item => item._id}
            />
          </View>
          <TextInput
            label="Address and Phone Number (required)"
            value={address}
            onChangeText={text => setAddress(text)}
          />
          {cart.length > 0 ? (
            <Button
              onPress={() => {
                const postCart = async () => {
                  await axios.post('/order', {
                    items: cart,
                    destination: address,
                  });
                };

                postCart();
              }}>
              Order!
            </Button>
          ) : (
            <></>
          )}
        </ScrollView>
      ) : (
        <View>
          <Text>Order has been placed!</Text>
        </View>
      )}
    </View>
  );
};

export default PlacePage;

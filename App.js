import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('itemdb.db'); //"tietokantaolio/kahva"

export default function App() {
  const [amount, setAmount] = useState(''); //tilamuuttuja inputia varten, määrä
  const [product, setProduct] = useState(''); //tilamuuttuja inputia varten, tuote
  const [items, setItems] = useState([]); //tilamuuttuja Flatlistia varten

  //Tietokannan luontilause, jos tietokantaa ei ole olemassa, se luodaan 
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, amount text, product text);');
    }, null, updateList); 
  }, []);

  // Save item
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into item (amount, product) values (?, ?);', [amount, product]);    
      }, null, updateList
    )
    setAmount('');
    setProduct('');
  }

    // Update list of items
    const updateList = () => {
      db.transaction(tx => {
        tx.executeSql('select * from item;', [], (_, { rows }) => {
          console.log(rows);
          setItems(rows._array)
        }); 
      });
    }

  /*
  // Update list of items
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from item;', [], (_, { rows }) => 
        setItems(rows._array)
      ); 
    });
  } 
  */

  // Delete item from list
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from item where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <TextInput placeholder='Product' style={{textAlign:'center', marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount, notes' style={{textAlign:'center', marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Add to shopping list" /> 
      <Text style={{marginTop: 30,marginBottom: 10, fontSize: 20}}>Buy: </Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>Buy: {item.product},  {item.amount} </Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Ok</Text></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 40,
  
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
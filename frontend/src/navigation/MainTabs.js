import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import POSScreen from '../screens/POSScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'POS') iconName = 'cash';
          else if (route.name === 'Transactions') iconName = 'clipboard-text';
          else if (route.name === 'Products') iconName = 'package';
          else if (route.name === 'Categories') iconName = 'format-list-bulleted';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="POS" component={POSScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      {isAdmin && (
        <>
          <Tab.Screen name="Products" component={ProductsScreen} />
          <Tab.Screen name="Categories" component={CategoriesScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default MainTabs;

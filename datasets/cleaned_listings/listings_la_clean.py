import os

os.chdir('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/dataset/inside_airbnb/united-states/ca/los-angeles')

import numpy as np
import pandas as pd


ladata = pd.read_csv('listings.csv')

cols = ladata.columns

columnlist = [ 'id','name','description','host_id','neighborhood_overview','neighbourhood_cleansed','latitude',
'longitude','accommodates','bathrooms_text','bedrooms','amenities','property_type',
'price']

listing_data =  ladata[columnlist]
listing_data['city'] = 'Los Angeles'
listing_data['state'] = 'California'

#cleaning ladata
listing_data.isnull().sum()

#drop names
listing_data = listing_data.drop(listing_data[listing_data['name'].isnull()].index,axis=0)

# null is fine for neighborhood

##we extract bathrooms from bathroom text

#61 null rows  =drop
listing_data = listing_data.drop(listing_data[listing_data['bathrooms_text'].isnull()].index,axis = 0)

bathrooms =  pd.Series([i.split(' ')[0] for i in listing_data['bathrooms_text']])
bathrooms = bathrooms.replace(['Half-bath', 0.5])
bathrooms = bathrooms.replace(['Private', 0.5])
bathrooms = bathrooms.replace(['Shared', 0.5])

bathrooms =  bathrooms.astype(float)

# Null bedrooms generally mean 0 bedrooms

listing_data.loc[listing_data['bedrooms'].isnull(), 'bedrooms'] = 0
listing_data['bedrooms'].isnull().sum()

# remove $ in price for further analysis
prices =  [i.split('$')[1] for i in listing_data['price']]
listing_data['price'] = prices

#change datatypes
listing_data.info()
listing_data['bathrooms'] = bathrooms
listing_data.drop('bathrooms_text',axis=1,inplace=True)
listing_data['bedrooms'] =  listing_data['bedrooms'].astype('int')

price_splitted =  [i.split(',')[0] for i in listing_data['price']]

listing_data['price'] = price_splitted
listing_data['price'] = listing_data['price'].astype('float')

#There are some rows where bathroom is null, despite amenities saying - bathtub as one of them
# drop these rows as its data loss

listing_data = listing_data.drop(listing_data[listing_data['bathrooms'].isnull()].index,axis = 0)

listing_data.columns

#rename columns to match relational attribute names
listing_data = listing_data.rename(columns = {'neighbourhood_cleansed':'neighborhood','price':'Price'})

listing_data.to_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/' + "Los Angeles" + '_'+ 'listings.csv',index=False)
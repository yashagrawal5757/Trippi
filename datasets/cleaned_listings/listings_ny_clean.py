
import os

os.chdir('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/dataset/inside_airbnb/united-states/ny/new-york-city')

import numpy as np
import pandas as pd

nydata = pd.read_csv('listings.csv') #37410 rows
cols = nydata.columns

columnlist = [ 'id','name','description','host_id','neighborhood_overview','neighbourhood_cleansed','latitude',
'longitude','accommodates','bathrooms_text','bedrooms','property_type','amenities',
'price']

listing_data =  nydata[columnlist]
listing_data['city'] = 'New York'
listing_data['state'] = 'New York city'

listing_data.isnull().sum()

#drop names
listing_data = listing_data.drop(listing_data[listing_data['name'].isnull()].index,axis=0)

#drop bathrooms text null and extract no of bathrooms from text
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

listing_data['bathrooms'] = bathrooms

listing_data.drop('bathrooms_text',axis=1,inplace=True)
listing_data['bedrooms'] =  listing_data['bedrooms'].astype('int')

price_splitted =  [i.split(',')[0] for i in listing_data['price']]

listing_data['price'] = price_splitted
listing_data['price'] = listing_data['price'].astype('float')

#There are some rows where bathroom is null, despite amenities saying - bathtub as one of them
# drop these rows as its data loss

listing_data = listing_data.drop(listing_data[listing_data['bathrooms'].isnull()].index,axis = 0)


#rename columns to match relational attribute names
listing_data = listing_data.rename(columns = {'neighbourhood_cleansed':'neighborhood','price':'Price'})

listing_data.to_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/' + "New York" + '_'+ 'listings.csv',index=False)

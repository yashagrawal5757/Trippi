import numpy as np
import pandas as pd
import os

#os.chdir('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/dataset/inside_airbnb/united-states/tx/Austin')
#os.chdir('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/dataset/inside_airbnb/united-states/il/chicago')

austindata = pd.read_csv('listings.csv') #17071 rows
chicagodata = pd.read_csv('listings.csv') #6720 rows


city = "Austin"
state = "Texas"

city = "Chicago"
state = "Illinois"


def data_clean(data,city,state):
    columnlist = [ 'id','name','description','host_id','neighborhood_overview','neighbourhood_cleansed','latitude',
    'longitude','accommodates','bathrooms_text','bedrooms','property_type','amenities',
    'price']
    
    listing_data =  data[columnlist]
    listing_data['city'] = city
    listing_data['state'] = state
        
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
    
    # remove $ in price for further analysis
    prices =  [i.split('$')[1] for i in listing_data['price']]
    listing_data['price'] = prices
    
    listing_data['bathrooms'] = bathrooms
    
    listing_data.drop('bathrooms_text',axis=1,inplace=True)
    listing_data['bedrooms'] =  listing_data['bedrooms'].astype('int')
    
    price_splitted =  [i.split(',')[0] for i in listing_data['price']]
    
    listing_data['price'] = price_splitted
    listing_data['price'] = listing_data['price'].astype('float')
    
    #There are some rows where bathroom is null, despite amenities saying - bathtub as one of them. drop these rows as its data loss

    listing_data = listing_data.drop(listing_data[listing_data['bathrooms'].isnull()].index,axis = 0)
    #There are some rows where bathroom is null, despite amenities saying - bathtub as one of them
    # drop these rows as its data loss

    listing_data = listing_data.drop(listing_data[listing_data['bathrooms'].isnull()].index,axis = 0)

    #rename columns to match relational attribute names
    listing_data = listing_data.rename(columns = {'neighbourhood_cleansed':'neighborhood','price':'Price'})
    
    return listing_data
     
    
    


#calling the above function
data = austindata
data = chicagodata
listing_data = data_clean(data,city,state)

#For Austin, we see nieghborhood cleansed is a zip code rather than textual description 

#austin_neighborhoods = pd.Series(listing_data['neighborhood'].unique(),name = 'zipcode')
    
listing_data.to_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/' + str(city) + '_'+ 'listings.csv',index=False)

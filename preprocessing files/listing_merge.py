import pandas as pd
import os
import re 
os.chdir('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets')

austin_data = pd.read_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/Austin_listings.csv')
nyc_data = pd.read_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/New York_listings.csv')
chicago_data = pd.read_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/Chicago_listings.csv')
la_data = pd.read_csv('C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/Los Angeles_listings.csv')

listings_data = pd.concat([la_data,nyc_data,chicago_data,austin_data])

listings_data['neighborhood_overview'] = listings_data['neighborhood_overview'].apply(lambda x: x.replace("'", "") if type(x) == str else x)


listings_data['name'] = listings_data['name'].apply(lambda x: x.replace("'", "") if type(x) == str else x)

#remove apostrophes from listings
listings_data['description'] = listings_data['description'].apply(lambda x: x.replace("'", "") if type(x) == str else x)


listings_data['neighborhood_overview'].info()

listings_data.to_csv('listings_data.csv',index=False)




#reviews_cleaned.to_csv('reviews_cleaned.csv',index=False)
#--------------------------------

hosts_data = pd.read_csv('hosts_data.csv')

hosts_data.drop_duplicates(subset= ['host_id'],inplace=True)
hosts_data.drop('id',axis=1,inplace=True)
hosts_data.to_csv('hosts_data.csv',index=False)

hosts_remove = set(hosts_data['host_id']) - set(listings_data['host_id'])

hosts_filtered = hosts_data[~hosts_data['host_id'].isin(hosts_remove)]
hosts_filtered.to_csv('hosts_data.csv',index=False)
hosts_data.shape
#----------------------------------------

#---------------------------------------------
attractions_df_new = pd.read_csv('attractions_df_new.csv')
attractions_df_new.drop_duplicates(subset= ['County','Lat','Lng'],inplace=True)
attractions_df_new.to_csv('attractions_df_new.csv',index=False)
#-----------------------------------
#review cleaning

reviews_cleaned = pd.read_csv("C:/Users/yasha/Desktop/Sem2/CIS 550 Databases/Project/datasets/reviews_cleaned.csv")




reviews_cleaned['listing_id'] = reviews_cleaned['listing_id'].astype('int64')
reviews_cleaned['rev_id'] = reviews_cleaned['rev_id'].astype('int64')

reviews_cleaned.info()
#nuniq = reviews_cleaned.listing_id.value_counts()

reviews_cleaned['rev_id'].min()
# remove apostrophe in comments
reviews_cleaned['comments'] = reviews_cleaned['comments'].apply(lambda x: x.replace("'", "") if type(x) == str else x)


reviews_remove = set(reviews_cleaned['listing_id']) - set(listings_data['id'])

#remove extra listings
reviews_filtered = reviews_cleaned[~reviews_cleaned['listing_id'].isin(reviews_remove)]


reviews_filtered['comments'] = reviews_filtered['comments'].str.replace(r'[^a-zA-Z0-9\s]', '').str.strip() + '.'

reviews_filtered.to_csv('reviews_filtered.csv',index=False)

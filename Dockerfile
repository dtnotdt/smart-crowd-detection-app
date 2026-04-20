FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files
COPY SmartStadium_Enhanced.html /usr/share/nginx/html/
COPY style_enhanced.css /usr/share/nginx/html/
COPY script_enhanced.js /usr/share/nginx/html/

# Also serve as index.html for root access
COPY SmartStadium_Enhanced.html /usr/share/nginx/html/index.html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

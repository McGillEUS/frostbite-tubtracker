#! /bin/bash
git add /srv/www/frostbite/tubtracker/tubs/*;
git commit -m "flavour history update";
git pull;
git push;
chmod 777 /srv/www/frostbite/tubtracker/tubs/*;
chown frostbite:frostbite /srv/www/frostbite/tubtracker/tubs/*;
chmod 775 /srv/www/frostbite/tubtracker/app/*;
chown frostbite:frostbite /srv/www/frostbite/tubtracker/app/*;
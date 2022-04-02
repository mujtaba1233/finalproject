mysqldump --host=localhost --user=root --password=mypass --routines intrepidcs | gzip > /tmp/mysqldumps/mydb.`date +"\%Y-\%m-\%d"`.gz
*/59 */23 * * */6 find /tmp/mysqldumps/ -maxdepth 1 -ctime +30 -exec rm {} \;
*/59 */23 * * */6 find /home/u-ba/Pictures/intrepidcs/admin-panel/files/RMA_Uploads/ -maxdepth 1 -ctime +30 -exec rm {} \;
*/59 */23 * * */6 find /home/u-ba/Pictures/intrepidcs/admin-panel/files/RMA_CSV/ -maxdepth 1 -ctime +30 -exec rm {} \;
*/59 */23 * * */6 find /home/u-ba/Pictures/intrepidcs/admin-panel/files/quotePDF/ -maxdepth 1 -ctime +30 -exec rm {} \;
*/59 */23 * * */6 find /home/u-ba/Pictures/intrepidcs/admin-panel/files/orderPDF/ -maxdepth 1 -ctime +30 -exec rm {} \;
*/59 */23 * * */6 find /home/u-ba/Pictures/intrepidcs/admin-panel/files/product-xml-files/ -maxdepth 1 -ctime +30 -exec rm {} \;

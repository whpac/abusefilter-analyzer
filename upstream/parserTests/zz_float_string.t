/* Float value of this expression has been observed on server to be slightly below 0.1
 but after conversion to string, 0.1 was returned. This test case was added to ensure
 a similar behavior in the JavaScript implementation */

string(1 - 9/10) === '0.1'
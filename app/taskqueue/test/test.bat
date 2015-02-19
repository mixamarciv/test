echo %date% %time% AAA
sleep 5
echo %date% %time% BBB
sleep 5

::pause


@FOR %%x IN (1,2,3,4,5,6,7,8,9,10) DO (
	echo %date% %time% test1 %%x
	sleep 2
)



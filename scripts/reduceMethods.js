
			function reduceAdd(p, v) {
			    p.total += v['end station longitude'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemove(p, v) {
			    p.total -= v['end station longitude'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitial() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddDuration(p, v) {
			    p.total += v['timeonbike'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemoveDuration(p, v) {
			    p.total -= v['timeonbike'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitialDuration() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddLat(p, v) {
					//console.log(v['start station id']);
					//console.log(p);
			    p.station = v['start station id'];
			    p.startlongi = v['start station longitude'];
			    p.startlati = v['start station latitude'];
			    p.endlati += v['end station latitude'];
			    p.endlongi += v['end station longitude'];
			    p.count++;
			    p.latiaverage = p.endlati / p.count;
			    p.longiaverage = p.endlongi / p.count;
			    return p;
			}
			function reduceRemoveLat(p, v) {
			    p.station = v['start station id'];
			    p.startlongi = v['start station longitude'];
			    p.startlati = v['start station latitude'];
			    p.endlati -= v['end station latitude'];
			    p.endlongi -= v['end station longitude'];
			    p.count--;
			    p.latiaverage = p.endlati / p.count;
			    p.longiaverage = p.endlongi / p.count;
			    return p;
			    return p;
			}
			function reduceInitialLat() {
			    return {
			        station: 0,
			        startlongi:0,
			        startlati:0,
			        endlongi:0,
			        endlati:0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddAge(p, v) {
			    p.total += v['ageonbike'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemoveAge(p, v) {
			    p.total -= v['ageonbike'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitialAge() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddGender(p, v) {
			    p.count++;
			    return p;
			}
			function reduceRemoveGender(p, v) {
			    p.count--;
			    return p;
			}
			function reduceInitialGender() {
			    return {
			        count: 0
			    };
			}
			function reduceAddBorough(p, v) {
			    p.count++;
			    return p;
			}
			function reduceRemoveBorough(p, v) {
			    p.count--;
			    return p;
			}
			function reduceInitialBorough() {
			    return {
			        count: 0
			    };
			}
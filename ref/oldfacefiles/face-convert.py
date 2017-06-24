def main():
    result={};

    with open("face-ids.txt","r",encoding="utf8") as infile:
        for x in infile:
            entry=x.split(",");

            if entry[1][-1]=="\n":
                entry[1]=entry[1][:-1];

            if entry[1] not in result:
                result[entry[1]]=[];

            result[entry[1]].append(entry[0]);

            # print(entry);

    with open("new-face.txt","w",encoding="utf8") as ofile:
        for x in result:
            wstring="{}: ".format(x);

            for y in result[x][:-1]:
                wstring+=y+",";

            wstring+=result[x][-1]+"\n";

            ofile.write(wstring);
\

main();